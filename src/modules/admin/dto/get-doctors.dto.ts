import { Transform } from "class-transformer";
import { IsInt, IsOptional, IsString, IsEnum, ValidateIf, IsDefined, Validate } from "class-validator";
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'MutuallyExclusive', async: false })
export class MutuallyExclusive implements ValidatorConstraintInterface {
    validate(propertyValue: string, args: ValidationArguments) {
        const object = args.object as any;
        const [relatedPropertyName] = args.constraints;
        const relatedValue = object[relatedPropertyName];
        // If this property has value, related property must NOT have value
        return propertyValue ? !relatedValue : true;
    }

    defaultMessage(args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        return `Cannot provide both '${args.property}' and '${relatedPropertyName}'`;
    }
}

export class GetDoctorsQueryDto {
    @IsOptional()
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    @ValidateIf(o => o.skip !== undefined)
    @IsDefined({ message: "If 'skip' is provided, 'take' is also required." })
    take?: number;

    @IsOptional()
    @IsInt()
    @Transform(({ value }) => parseInt(value))
    @ValidateIf(o => o.take !== undefined)
    @IsDefined({ message: "If 'take' is provided, 'skip' is also required." })
    skip?: number;

    @IsOptional()
    @IsString()
    @Validate(MutuallyExclusive, ['search_by_id'])
    search_by_name?: string;

    @IsOptional()
    @IsString()
    @Validate(MutuallyExclusive, ['search_by_name'])
    search_by_id?: string;

    @IsOptional()
    @IsEnum(['asc', 'desc'])
    sort_by_name?: 'asc' | 'desc';
}
