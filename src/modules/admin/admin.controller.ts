import { Controller, Get, Query } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { GetDoctorsQueryDto } from "./dto/get-doctors-query.dto";

@Controller("admin")
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get("doctors")
    async getDoctors(@Query() query: GetDoctorsQueryDto) {
        return this.adminService.getDoctors(query);
    }
}