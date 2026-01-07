import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from 'drizzle/drizzle.provider';
import * as schema from '../../drizzle/drizzle.schema';
import { and, asc, count, desc, eq, ilike, SQL } from 'drizzle-orm';

interface CreateParams {
  user_id: string;
  national_id: string;
  name: string;
  birth_date: Date;
  gender: (typeof schema.patients.gender.enumValues)[number];
  phone: string;
  address: string;
}

interface FindManyPatientParams {
  take?: number;
  skip?: number;
  search_by_name?: string;
  search_by_id?: string;
  sort_by_name?: 'asc' | 'desc';
}

interface UpdatePatientParams {
  id: string;
  national_id?: string;
  name?: string;
  birth_date?: Date;
  gender?: (typeof schema.patients.gender.enumValues)[number];
  phone?: string;
  address?: string;
}

@Injectable()
export class PatientRepository {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof schema>,
  ) {}

  async findPatientByUserId(userId: string) {
    return this.db.query.patients.findFirst({
      where: eq(schema.patients.userId, userId),
    });
  }

  async findMany(query: FindManyPatientParams) {
    const order =
      query.sort_by_name === 'desc'
        ? desc(schema.patients.name)
        : asc(schema.patients.name);
    const filters: SQL[] = [];

    if (query.search_by_name)
      filters.push(ilike(schema.patients.name, `%${query.search_by_name}%`));
    if (query.search_by_id)
      filters.push(eq(schema.patients.id, query.search_by_id));

    const whereCondition = filters.length > 0 ? and(...filters) : undefined;

    const [patients, total_data] = await Promise.all([
      this.db.query.patients.findMany({
        where: whereCondition,
        limit: typeof query.take === 'number' ? query.take : undefined,
        offset: typeof query.skip === 'number' ? query.skip : undefined,
        orderBy: [order],
        with: {
          user: { columns: { email: true } },
        },
      }),
      this.db
        .select({ count: count() })
        .from(schema.patients)
        .where(whereCondition)
        .then((res) => res[0]?.count ?? 0),
    ]);

    return { patients, total_data };
  }

  async create(data: CreateParams) {
    const [newUser] = await this.db
      .insert(schema.patients)
      .values({
        nationalId: data.national_id,
        name: data.name,
        dob: new Date(data.birth_date).toISOString().split('T')[0],
        gender: data.gender,
        phone: data.phone,
        address: data.address,
        userId: data.user_id,
      })
      .returning({
        id: schema.patients.id,
        nationalId: schema.patients.nationalId,
        name: schema.patients.name,
        dob: schema.patients.dob,
        gender: schema.patients.gender,
        phone: schema.patients.phone,
        address: schema.patients.address,
        userId: schema.patients.userId,
      });

    return newUser;
  }

  async update(params: UpdatePatientParams) {
    const [updatedPatient] = await this.db
      .update(schema.patients)
      .set({
        nationalId: params.national_id,
        name: params.name,
        dob: params.birth_date
          ? new Date(params.birth_date).toISOString().split('T')[0]
          : undefined,
        gender: params.gender,
        phone: params.phone,
        address: params.address,
      })
      .where(eq(schema.patients.id, params.id))
      .returning();

    return updatedPatient;
  }

  async delete(id: string) {
    await this.db.delete(schema.patients).where(eq(schema.patients.id, id));
    return { id };
  }

  async findConsultedPatients(query: FindManyPatientParams): Promise<{ patients: any[]; total_data: number }> {
    const order =
      query.sort_by_name === 'desc'
        ? desc(schema.patients.name)
        : asc(schema.patients.name);
    const filters: SQL[] = [];

    if (query.search_by_name)
      filters.push(ilike(schema.patients.name, `%${query.search_by_name}%`));
    if (query.search_by_id)
      filters.push(eq(schema.patients.id, query.search_by_id));

    const whereCondition = filters.length > 0 ? and(...filters) : undefined;

    let qb: any = this.db
      .select({ patient: schema.patients })
      .from(schema.patients)
      .innerJoin(
        schema.medicalRecords,
        eq(schema.medicalRecords.patientId, schema.patients.id),
      )
      .where(whereCondition)
      .orderBy(order);

    if (typeof query.take === 'number') qb = qb.limit(query.take);
    if (typeof query.skip === 'number') qb = qb.offset(query.skip);

    const patients = await qb.then((res: any[]) => res.map((r) => r.patient));

    const total_data = await this.db
      .select({ count: count() })
      .from(schema.patients)
      .innerJoin(
        schema.medicalRecords,
        eq(schema.medicalRecords.patientId, schema.patients.id),
      )
      .where(whereCondition)
      .then((res) => res[0]?.count ?? 0);

    return { patients, total_data };
  }
}
