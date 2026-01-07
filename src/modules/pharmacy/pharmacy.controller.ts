import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { PharmacyService } from './pharmacy.service';
import { JwtToken } from 'src/utils/JwtToken';
import { PharmacyMiddleware } from 'src/middlewares/pharmacy.middleware';
import type { CreatePrescriptionDto } from 'src/modules/pharmacy/dto/create-prescription.dto';

@Controller('pharmacy')
@UseGuards(PharmacyMiddleware)
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) { }

  @Post('prescriptions')
  async createPrescription(
    @Body() dto: CreatePrescriptionDto,
    @Req() req: Request,
  ): Promise<any> {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('Authorization header missing');
    const token = authHeader.split(' ')[1];
    JwtToken.verify(token);

    return await this.pharmacyService.createAndGivePrescription(dto);
  }

  @Post('prescriptions/:id/give')
  async givePrescription(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<any> {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      throw new UnauthorizedException('Authorization header missing');
    const token = authHeader.split(' ')[1];
    JwtToken.verify(token);

    return await this.pharmacyService.giveExistingPrescription(id);
  }

  @Get('patients/consulted')
  async getConsultedPatients(@Query() query): Promise<any> {
    return await this.pharmacyService.getConsultedPatients(query);
  }
}
