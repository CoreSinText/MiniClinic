import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsMutuallyExclusiveWith(relatedProperties: string[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isMutuallyExclusiveWith',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [relatedProperties],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedProps] = args.constraints;
                    const obj = args.object as any;
                    if (value !== undefined) {
                        for (const prop of relatedProps) {
                            if (obj[prop] !== undefined) return false;
                        }
                    }
                    return true;
                },
                defaultMessage(args: ValidationArguments) {
                    const [relatedProps] = args.constraints;
                    return `${args.property} cannot be used simultaneously with: ${relatedProps.join(', ')}`;
                }
            },
        });
    };
}
