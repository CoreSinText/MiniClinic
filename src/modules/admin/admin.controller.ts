import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { GetDoctorsQueryDto } from "./dto/get-doctors.dto";
import { PatchDoctorDto } from "./dto/patch-doctor.dto";
import { PostDoctorDto } from "./dto/post-doctor.dto";
import { PostScheduleDoctorDto } from "./dto/post-schedule-doctor.dto";
import { PatchScheduleDoctorDto } from "./dto/patch-schedule-doctor.dto";
import { GetScheduleDoctorDto } from "./dto/get-schedule-doctor.dto";

@Controller("admin")
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get("doctors")
    async getDoctors(@Query() query: GetDoctorsQueryDto) {
        return this.adminService.getDoctors(query);
    }

    @Patch("doctor/:id")
    async patchDoctor(@Param("id") id: string, @Body() dto: PatchDoctorDto) {
        return this.adminService.patchDoctor(id, dto);
    }

    @Post("doctor")
    async postDoctor(@Body() dto: PostDoctorDto) {
        return this.adminService.postDoctor(dto);
    }

    @Get("schedules-doctor")
    async getSchedulesDoctor(@Query() query: GetScheduleDoctorDto) {
        return this.adminService.getScheduleDoctor(query);
    }

    @Post("schedule-doctor")
    async postScheduleDoctor(@Body() dto: PostScheduleDoctorDto) {
        return this.adminService.postScheduleDoctor(dto);
    }

    @Patch("schedule-doctor/:id")
    async patchScheduleDoctor(@Param("id") id: string, @Body() dto: PatchScheduleDoctorDto) {
        return this.adminService.patchScheduleDoctor(id, dto);
    }

    @Delete("schedule-doctor/:id")
    async deleteScheduleDoctor(@Param("id") id: string) {
        return this.adminService.deleteScheduleDoctor(id);
    }


}