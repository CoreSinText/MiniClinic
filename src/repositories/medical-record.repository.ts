import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../../drizzle/drizzle.provider';
import * as schema from '../../drizzle/drizzle.schema';
import { InferInsertModel, InferModel, desc, eq } from 'drizzle-orm';

type NewMedicalRecord = InferInsertModel<typeof schema.medicalRecords>;
export type MedicalRecord = InferModel<typeof schema.medicalRecords>;

@Injectable()
export class MedicalRecordRepository {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof schema>,
  ) { }

  async create(data: NewMedicalRecord, tx?: any) {
    const executor = tx || this.db;
    const [result] = await executor
      .insert(schema.medicalRecords)
      .values(data)
      .returning();
    return result;
  }

  async findByPatientId(patientId: string) {
    const records = await this.db.query.medicalRecords.findMany({
      where: eq(schema.medicalRecords.patientId, patientId),
      orderBy: [desc(schema.medicalRecords.createdAt)],
      with: {
        prescription: {
          with: {
            // include prescription items and medicines
            // using manual query for items
          },
        },
        appointment: {
          with: {
            doctor: {
              with: { user: { columns: { email: true } } },
              columns: { name: true },
            },
          },
        },
      },
    });

    // for each record, fetch prescription items separately (to include medicine data)
    const results = await Promise.all(
      records.map(async (rec) => {
        const prescription = await this.db
          .select()
          .from(schema.prescriptions)
          .where(eq(schema.prescriptions.medicalRecordId, rec.id))
          .then((r) => r[0] ?? null);
        if (!prescription) return { ...rec, prescription: null };
        const items = await this.db.query.prescriptionItems.findMany({
          where: eq(schema.prescriptionItems.prescriptionId, prescription.id),
          with: {
            medicine: {
              columns: {
                id: true,
                name: true,
                stock: true,
                price: true,
                unit: true,
              },
            },
          },
        });
        return { ...rec, prescription: { ...prescription, items } };
      }),
    );

    return results;
  }

  async findById(id: string) {
    const [rec] = await this.db
      .select()
      .from(schema.medicalRecords)
      .where(eq(schema.medicalRecords.id, id))
      .then((r) => r);

    return rec ?? null;
  }
}
