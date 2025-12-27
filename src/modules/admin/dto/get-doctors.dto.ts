import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsString, IsEnum, ValidateIf, IsDefined } from "class-validator";
import { IsMutuallyExclusiveWith } from "src/utils/decorators";


export class GetDoctorsQueryDto {
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
