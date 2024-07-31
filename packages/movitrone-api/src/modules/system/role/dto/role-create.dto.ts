import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

import { OperatorDto } from '~/common/dto/operator.dto';
import { IsUnique } from '~/shared/database/constraints/unique.constraint';

import { RoleEntity } from '../entity/role.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateRoleDto extends OperatorDto {
  @ApiProperty({ description: 'Role Name' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: 'Role name length cannot be less than 2' })
  name: string;

  @IsUnique({ entity: RoleEntity })
  @ApiProperty({ description: 'Role Identifier' })
  @IsString()
  @Matches(/^[a-z0-9]+$/i, {
    message: 'Role value can only contain letters and numbers',
  })
  @MinLength(2, { message: 'Role value length cannot be less than 2' })
  value: string;

  @ApiProperty({ description: 'Status' })
  @IsIn([0, 1])
  status: number;

  @ApiProperty({
    type: Number,
    isArray: true,
    description: 'Associated Menu, Permission IDs',
  })
  @IsOptional()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  menuIds?: number[];
}
