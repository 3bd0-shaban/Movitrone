import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

import { OperatorDto } from '~/common/dto/operator.dto';
import { MENU_TYPES_ENUM } from '../menu.constant';

export class CreateMenuDto extends OperatorDto {
  @ApiProperty({ description: 'Menu type' })
  @IsNotEmpty()
  @IsEnum(MENU_TYPES_ENUM)
  type: MENU_TYPES_ENUM;

  @ApiProperty({ description: 'Parent menu' })
  @IsOptional()
  @IsInt()
  parentId: number;

  @ApiProperty({ description: 'Menu or permission name' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: 'Frontend route address' })
  // @Matches(/^[/]$/)
  @ValidateIf((o) => o.type !== 2)
  path: string;

  @ApiProperty({ description: 'Corresponding permission' })
  @ValidateIf((o: CreateMenuDto) => o.type === 2)
  @IsString()
  @IsOptional()
  permission: string;
}
