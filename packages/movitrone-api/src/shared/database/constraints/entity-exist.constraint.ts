import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { DataSource, ObjectType, Repository } from 'typeorm';

interface Condition {
  entity: ObjectType<any>;
  // If no field is specified, use the current validation property as the query basis
  field?: string;
}

/**
 * Check if the value of a certain field exists in the data table
 */
@ValidatorConstraint({ name: 'entityItemExist', async: true })
@Injectable()
export class EntityExistConstraint implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  async validate(value: string, args: ValidationArguments) {
    let repo: Repository<any>;

    if (!value) return true;
    // The default comparison field is id
    let field = 'id';
    // Get the repository of the entity through the passed entity
    if ('entity' in args.constraints[0]) {
      // The passed object can specify the comparison field
      field = args.constraints[0].field ?? 'id';
      repo = this.dataSource.getRepository(args.constraints[0].entity);
    } else {
      // The passed object is an entity class
      repo = this.dataSource.getRepository(args.constraints[0]);
    }
    // Validate by checking if the record exists
    const item = await repo.findOne({ where: { [field]: value } });
    return !!item;
  }

  defaultMessage(args: ValidationArguments) {
    if (!args.constraints[0]) return 'Model not been specified!';

    return `All instances of ${args.constraints[0].name} must exist in the database!`;
  }
}

/**
 * Data existence validation
 * @param entity Entity class or validation condition object
 * @param validationOptions
 */
function IsEntityExist(
  entity: ObjectType<any>,
  validationOptions?: ValidationOptions,
): (object: Record<string, any>, propertyName: string) => void;

function IsEntityExist(
  condition: { entity: ObjectType<any>; field?: string },
  validationOptions?: ValidationOptions,
): (object: Record<string, any>, propertyName: string) => void;

function IsEntityExist(
  condition: ObjectType<any> | { entity: ObjectType<any>; field?: string },
  validationOptions?: ValidationOptions,
): (object: Record<string, any>, propertyName: string) => void {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [condition],
      validator: EntityExistConstraint,
    });
  };
}

export { IsEntityExist };
