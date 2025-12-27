import { Inject, Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DrizzleAsyncProvider } from "drizzle/drizzle.provider";
import * as schema from '../../drizzle/drizzle.schema';
import { and, asc, count, desc, eq, gte, SQL } from "drizzle-orm";
import { lte } from "drizzle-orm";


interface FindManyParam {
    skip?: number;
    take?: number;
    search_by_doctor_id?: string
    search_by_active?: boolean
    sort_by_start_time?: 'asc' | 'desc'
    sort_by_end_time?: 'asc' | 'desc'
}

interface ConflictScheduleParam {
    doctor_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
}

interface UpdateParam {
    id: string;
    dayOfWeek: number;
    isActive: boolean;
    startTime: string;
    endTime: string;
}

@Injectable()
export class ScheduleDoctorRepository {
    constructor(@Inject(DrizzleAsyncProvider) private readonly db: NodePgDatabase<typeof schema>) { }

    async findById(id: string) {
        return await this.db.select().from(schema.doctorSchedules).where(eq(schema.doctorSchedules.id, id));
    }

    async conflictSchedule(param: ConflictScheduleParam): Promise<boolean> {
        const schedule = await this.db.select().from(schema.doctorSchedules).where(and(eq(schema.doctorSchedules.doctorId, param.doctor_id), eq(schema.doctorSchedules.dayOfWeek, param.day_of_week), and(gte(schema.doctorSchedules.startTime, param.start_time), lte(schema.doctorSchedules.endTime, param.end_time))));
        return schedule.length > 0;
    }

    async findMany(param: FindManyParam) {
        const orderStartDate = param.sort_by_start_time === 'asc' ? asc(schema.doctorSchedules.startTime) : desc(schema.doctorSchedules.startTime);
        const orderEndDate = param.sort_by_end_time === 'asc' ? asc(schema.doctorSchedules.endTime) : desc(schema.doctorSchedules.endTime);
        const filters: SQL[] = [];

        if (param.search_by_doctor_id) filters.push(eq(schema.doctorSchedules.doctorId, param.search_by_doctor_id));
        if (param.search_by_active) filters.push(eq(schema.doctorSchedules.isActive, param.search_by_active));

        const whereCondition = filters.length > 0 ? and(...filters) : undefined;
        const orderBy = [orderStartDate, orderEndDate];

        const [data, total_data] = await Promise.all([
            this.db.query.doctorSchedules.findMany({
                where: whereCondition,
                limit: param.take,
                offset: param.skip,
                orderBy: orderBy,
                with: {
                    doctor: { columns: { name: true } }
                }
            }),
            this.db.select({ count: count() }).from(schema.doctorSchedules).where(whereCondition).then(res => res[0]?.count ?? 0)
        ])

        return { data, total_data };
    }

    private getDayName(day: number): string {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[day] || '';
    }

    async create(param: typeof schema.doctorSchedules.$inferInsert) {
        const [inserted] = await this.db.insert(schema.doctorSchedules).values({
            doctorId: param.doctorId,
            dayOfWeek: param.dayOfWeek,
            isActive: param.isActive,
            startTime: param.startTime,
            endTime: param.endTime
        }).returning({
            id: schema.doctorSchedules.id
        });

        const result = await this.db.query.doctorSchedules.findFirst({
            where: eq(schema.doctorSchedules.id, inserted.id),
            with: {
                doctor: {
                    columns: {
                        name: true
                    }
                }
            }
        });

        if (!result) throw new Error('Failed to create schedule');

        return {
            id: result.id,
            day_of_week: result.dayOfWeek,
            day_name: this.getDayName(result.dayOfWeek),
            is_active: result.isActive,
            time: {
                start: result.startTime,
                end: result.endTime
            },
            doctor: {
                id: result.doctorId,
                name: result.doctor.name
            }
        };
    }

    async update(param: UpdateParam) {
        if (!param.id) throw new Error('Schedule ID is required for update');

        const updated = await this.db.update(schema.doctorSchedules).set(param).where(eq(schema.doctorSchedules.id, param.id)).returning({
            id: schema.doctorSchedules.id
        });

        if (!updated) throw new Error('Failed to update schedule');

        const result = await this.db.query.doctorSchedules.findFirst({
            where: eq(schema.doctorSchedules.id, updated[0].id),
            with: { doctor: { columns: { name: true } } }
        });

        if (!result) throw new Error('Failed to find updated schedule');

        return {
            id: result.id,
            day_of_week: result.dayOfWeek,
            day_name: this.getDayName(result.dayOfWeek),
            is_active: result.isActive,
            time: { start: result.startTime, end: result.endTime },
            doctor: { id: result.doctorId, name: result.doctor.name }
        };
    }

    async delete(id: string) {
        await this.db.delete(schema.doctorSchedules).where(eq(schema.doctorSchedules.id, id)).returning({
            id: schema.doctorSchedules.id
        })
        return { id: id };
    }
}