import {
  IsArray,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
  IsString,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class PrescriptionItemDto {
  @IsUUID()
  medicineId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsString()
  instructions: string;
}

export class CreatePrescriptionDto {
  @IsUUID()
  medicalRecordId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items: PrescriptionItemDto[];
}
