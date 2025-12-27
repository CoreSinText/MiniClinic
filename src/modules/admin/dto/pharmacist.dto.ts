import { IsDefined, IsEmail, IsEnum, IsInt, IsOptional, IsString, MinLength, ValidateIf } from "class-validator";
import { Transform } from "class-transformer";
import { IsMutuallyExclusiveWith } from "src/utils/decorators";

export class GetPharmacistsQueryDto {
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

export class PostPharmacistDto {
    @IsString()
    name: string;

    @IsEnum(['Male', 'Female'])
    gender: 'Male' | 'Female';

    @IsString()
    license_number: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}

export class PatchPharmacistDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEnum(['Male', 'Female'])
    gender?: 'Male' | 'Female';

    @IsOptional()
    @IsString()
    license_number?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    password?: string;
}
