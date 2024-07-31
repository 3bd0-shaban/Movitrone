import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { isNil, merge } from 'lodash';
import { DataSource, ObjectType } from 'typeorm';

interface Condition {
  entity: ObjectType<any>;
  // If no field is specified, use the current validation property as the query basis
  field?: string;
}

/**
 * Validate the uniqueness of a certain field
 */
@ValidatorConstraint({ name: 'entityItemUnique', async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments) {
    // Get the model and field to validate
    const config: Omit<Condition, 'entity'> = {
      field: args.property,
    };
    const condition = ('entity' in args.constraints[0]
      ? merge(config, args.constraints[0])
      : {
          ...config,
          entity: args.constraints[0],
        }) as unknown as Required<Condition>;
    if (!condition.entity) return false;
    try {
      // Query if the data exists, if it already exists, validation fails
      const repo = this.dataSource.getRepository(condition.entity);
      return isNil(
        await repo.findOne({
          where: { [condition.field]: value },
        }),
      );
    } catch (err) {
      // If there's a database operation exception, validation fails
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const { entity, property } = args.constraints[0];
    const queryProperty = property ?? args.property;
    if (!(args.object as any).getManager)
      return 'getManager function not been found!';

    if (!entity) return 'Model not been specified!';

    return `${queryProperty} of ${entity.name} must be unique!`;
  }
}

/**
 * Data uniqueness validation
 * @param entity Entity class or validation condition object
 * @param validationOptions
 */
function IsUnique(
  entity: ObjectType<any>,
  validationOptions?: ValidationOptions,
): (object: Record<string, any>, propertyName: string) => void;

function IsUnique(
  condition: Condition,
  validationOptions?: ValidationOptions,
): (object: Record<string, any>, propertyName: string) => void;

function IsUnique(
  params: ObjectType<any> | Condition,
  validationOptions?: ValidationOptions,
) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [params],
      validator: UniqueConstraint,
    });
  };
}

export { IsUnique };
