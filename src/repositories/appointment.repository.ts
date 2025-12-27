import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from '../../drizzle/drizzle.provider';
import * as schema from '../../drizzle/drizzle.schema';
import { and, asc, between, count, desc, eq, ilike, SQL, sql } from 'drizzle-orm';

interface CreateAppointmentParams {
    queue_number: number;
    date: Date;
    patient_id: string;
    doctor_id: string;
    status?: typeof schema.appointments.status.enumValues[number];
}

interface FindManyAppointmentParams {
    take?: number;
    skip?: number;
    date?: string; // YYYY-MM-DD
    doctor_id?: string;
    status?: typeof schema.appointments.status.enumValues[number];
}

interface UpdateAppointmentParams {
    id: string;
    status?: typeof schema.appointments.status.enumValues[number];
    date?: Date;
    queue_number?: number;
}

@Injectable()
export class AppointmentRepository {
    constructor(
        @Inject(DrizzleAsyncProvider)
        private db: NodePgDatabase<typeof schema>,
    ) { }

    async create(params: CreateAppointmentParams) {
        const [newAppointment] = await this.db.insert(schema.appointments).values({
            queueNumber: params.queue_number,
            date: params.date,
            patientId: params.patient_id,
            doctorId: params.doctor_id,
            status: params.status || 'WAITING'
        }).returning();

        return newAppointment;
    }

    async findMany(query: FindManyAppointmentParams) {
        const filters: SQL[] = [];

        if (query.doctor_id) filters.push(eq(schema.appointments.doctorId, query.doctor_id));
        if (query.status) filters.push(eq(schema.appointments.status, query.status));

        if (query.date) {
            // Filter by exact date (ignoring time)
            const startOfDay = new Date(query.date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(query.date);
            endOfDay.setHours(23, 59, 59, 999);

            filters.push(between(schema.appointments.date, startOfDay, endOfDay));
        }

        const whereCondition = filters.length > 0 ? and(...filters) : undefined;
        const order = asc(schema.appointments.date); // ASC by date usually makes sense for schedule

        const [appointments, total_data] = await Promise.all([
            this.db.query.appointments.findMany({
                where: whereCondition,
                limit: query.take,
                offset: query.skip,
                orderBy: [order],
                with: {
                    doctor: true,
                    patient: true
                }
            }),
            this.db
                .select({ count: count() })
                .from(schema.appointments)
                .where(whereCondition)
                .then(res => res[0]?.count ?? 0)
        ]);

        return { appointments, total_data };
    }

    async findById(id: string) {
        return this.db.query.appointments.findFirst({
            where: eq(schema.appointments.id, id),
            with: {
                doctor: true,
                patient: true
            }
        });
    }

    async update(params: UpdateAppointmentParams) {
        const [updated] = await this.db.update(schema.appointments)
            .set({
                status: params.status,
                date: params.date,
                queueNumber: params.queue_number
            })
            .where(eq(schema.appointments.id, params.id))
            .returning();

        return updated;
    }

    async countDoctorAppointments(doctorId: string, date: Date): Promise<number> {
        // Count appointments for a specific doctor on a specific date to determine next queue number
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const result = await this.db
            .select({ count: count() })
            .from(schema.appointments)
            .where(and(
                eq(schema.appointments.doctorId, doctorId),
                between(schema.appointments.date, startOfDay, endOfDay)
            ));

        return result[0]?.count ?? 0;
    }
}
