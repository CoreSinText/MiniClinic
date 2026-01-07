import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../../drizzle/drizzle.provider';
import * as schema from '../../drizzle/drizzle.schema';
import { InferInsertModel, InferModel, eq } from 'drizzle-orm';

type NewPrescription = InferInsertModel<typeof schema.prescriptions>;
export type Prescription = InferModel<typeof schema.prescriptions>;
type NewPrescriptionItem = InferInsertModel<typeof schema.prescriptionItems>;
export type PrescriptionItem = InferModel<typeof schema.prescriptionItems>;

@Injectable()
export class PrescriptionRepository {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof schema>,
  ) {}

  async create(data: NewPrescription, tx?: any): Promise<Prescription> {
    const executor = tx || this.db;
    const [result] = await executor
      .insert(schema.prescriptions)
      .values(data)
      .returning();
    return result;
  }

  async createItems(data: NewPrescriptionItem[], tx?: any): Promise<PrescriptionItem[]> {
    const executor = tx || this.db;
    return await executor
      .insert(schema.prescriptionItems)
      .values(data)
      .returning();
  }

  async findByIdWithItems(id: string): Promise<(Prescription & { items: PrescriptionItem[] }) | null> {
    const [prescription] = await this.db
      .select()
      .from(schema.prescriptions)
      .where(eq(schema.prescriptions.id, id))
      .then((r) => r);
    if (!prescription) return null;
    const items = await this.db.query.prescriptionItems.findMany({
      where: eq(schema.prescriptionItems.prescriptionId, id),
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
    return { ...prescription, items };
  }

  async updateStatus(
    id: string,
    status: (typeof schema.prescriptions.status.enumValues)[number],
  ): Promise<Prescription> {
    const [updated] = await this.db
      .update(schema.prescriptions)
      .set({ status })
      .where(eq(schema.prescriptions.id, id))
      .returning();
    return updated;
  }

  async findByMedicalRecordId(medicalRecordId: string): Promise<Prescription | null> {
    const [prescription] = await this.db
      .select()
      .from(schema.prescriptions)
      .where(eq(schema.prescriptions.medicalRecordId, medicalRecordId))
      .then((r) => r);
    return prescription ?? null;
  }
}
