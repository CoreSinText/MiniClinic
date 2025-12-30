import { Body, Controller, Post, Get, Request, UseGuards } from "@nestjs/common";
import { PostConsultationDto } from "./dto/post-consultation.dto";
import { DoctorService } from "./doctor.service";
import { JwtToken } from "src/utils/JwtToken";
import { DoctorMiddleware } from "src/middlewares/doctor.middleware";

@Controller("doctor")
@UseGuards(DoctorMiddleware)
export class DoctorController {
    constructor(private readonly doctorService: DoctorService) { }

    @Post("consultation")
    async postConsultation(@Body() dto: PostConsultationDto, @Request() req) {
        const header = req.headers['authorization']
        const token = header.split(' ')[1];
        const decoded = JwtToken.verify(token);
        return this.doctorService.postConsultation(dto, decoded.id);
    }

    @Get("consultation/in-progress")
    async getInProgress(@Request() req) {
        const header = req.headers['authorization']
        const token = header.split(' ')[1];
        const decoded = JwtToken.verify(token);

        return this.doctorService.getInProgress(decoded.id);
    }
}   