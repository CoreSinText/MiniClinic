import { Body, Controller, Get, Param, Patch, Query } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { GetDoctorsQueryDto } from "./dto/get-doctors.dto";
import { PatchDoctorDto } from "./dto/patch-doctor.dto";

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
}