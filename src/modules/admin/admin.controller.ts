import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { GetDoctorsQueryDto } from "./dto/get-doctors.dto";
import { PatchDoctorDto } from "./dto/patch-doctor.dto";
import { PostDoctorDto } from "./dto/post-doctor.dto";
import { PostScheduleDoctorDto } from "./dto/post-schedule-doctor.dto";
import { PatchScheduleDoctorDto } from "./dto/patch-schedule-doctor.dto";
import { GetScheduleDoctorDto } from "./dto/get-schedule-doctor.dto";
import { GetPatientsQueryDto, PostPatientDto, PatchPatientDto } from "./dto/patient.dto";
import { GetPharmacistsQueryDto, PostPharmacistDto, PatchPharmacistDto } from "./dto/pharmacist.dto";
import { GetMedicinesQueryDto, PostMedicineDto, PatchMedicineDto } from "./dto/medicine.dto";
import { GetAppointmentsQueryDto, PatchAppointmentDto, PostAppointmentDto } from "./dto/appointment.dto";

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

    // Patient
    @Get("patients")
    async getPatients(@Query() query: GetPatientsQueryDto) {
        return this.adminService.getPatients(query);
    }

    @Post("patient")
    async postPatient(@Body() dto: PostPatientDto) {
        return this.adminService.postPatient(dto);
    }

    @Patch("patient/:id")
    async patchPatient(@Param("id") id: string, @Body() dto: PatchPatientDto) {
        return this.adminService.patchPatient(id, dto);
    }

    @Delete("patient/:id")
    async deletePatient(@Param("id") id: string) {
        return this.adminService.deletePatient(id);
    }

    // Pharmacist
    @Get("pharmacists")
    async getPharmacists(@Query() query: GetPharmacistsQueryDto) {
        return this.adminService.getPharmacists(query);
    }

    @Post("pharmacist")
    async postPharmacist(@Body() dto: PostPharmacistDto) {
        return this.adminService.postPharmacist(dto);
    }

    @Patch("pharmacist/:id")
    async patchPharmacist(@Param("id") id: string, @Body() dto: PatchPharmacistDto) {
        return this.adminService.patchPharmacist(id, dto);
    }

    @Delete("pharmacist/:id")
    async deletePharmacist(@Param("id") id: string) {
        return this.adminService.deletePharmacist(id);
    }

    // Medicine
    @Get("medicines")
    async getMedicines(@Query() query: GetMedicinesQueryDto) {
        return this.adminService.getMedicines(query);
    }

    @Post("medicine")
    async postMedicine(@Body() dto: PostMedicineDto) {
        return this.adminService.postMedicine(dto);
    }

    @Patch("medicine/:id")
    async patchMedicine(@Param("id") id: string, @Body() dto: PatchMedicineDto) {
        return this.adminService.patchMedicine(id, dto);
    }

    @Delete("medicine/:id")
    async deleteMedicine(@Param("id") id: string) {
        return this.adminService.deleteMedicine(id);
    }

    // Appointment
    @Get("patient/appointments")
    async getAppointments(@Query() query: GetAppointmentsQueryDto) {
        return this.adminService.getAppointments(query);
    }

    @Post("patient/appointment")
    async postAppointment(@Body() dto: PostAppointmentDto) {
        return this.adminService.postAppointment(dto);
    }

    @Patch("patient/appointment/:id")
    async patchAppointment(@Param("id") id: string, @Body() dto: PatchAppointmentDto) {
        return this.adminService.patchAppointment(id, dto);
    }

    @Patch("prescription/:id/dispense")
    async dispensePrescription(@Param("id") id: string) {
        return this.adminService.dispensePrescription(id);
    }
}