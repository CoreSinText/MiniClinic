import { IsDefined, IsEnum, IsInt, IsOptional, IsString, Length, Matches, ValidateIf } from "class-validator";
import { Transform } from "class-transformer";
import { IsMutuallyExclusiveWith } from "src/utils/decorators";

export class GetPatientsQueryDto {
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    @ValidateIf(o => o.skip !== undefined)
    @IsDefined({ message: "If 'skip' is provided, 'take' is also required." })
    take?: number;

    @IsInt()
    @Transform(({ value }) => parseInt(value))
    @ValidateIf(o => o.take !== undefined)
    @IsDefined({ message: "If 'take' is provided, 'skip' is also required." })
    skip?: number;

    @IsOptional()
    @IsString()
    @IsMutuallyExclusiveWith(['search_by_id'])
    search_by_name?: string;

    @IsOptional()
    @IsString()
    @IsMutuallyExclusiveWith(['search_by_name'])
    search_by_id?: string;

    @IsOptional()
    @IsEnum(['asc', 'desc'])
    sort_by_name?: 'asc' | 'desc';
}

export class PostPatientDto {
    @IsString()
    @Length(16, 16)
    @Matches(/^\d+$/, { message: "National ID must be numeric" })
    national_id: string;

    @IsString()
    name: string;

    @IsString()
    birth_date: string; // ISO Date string YYYY-MM-DD

    @IsEnum(['Male', 'Female'])
    gender: 'Male' | 'Female';

    @IsString()
    phone: string;

    @IsString()
    address: string;
}

export class PatchPatientDto {
    @IsOptional()
    @IsString()
    @Length(16, 16)
    @Matches(/^\d+$/, { message: "National ID must be numeric" })
    national_id?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    birth_date?: string;

    @IsOptional()
    @IsEnum(['Male', 'Female'])
    gender?: 'Male' | 'Female';

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;
}
