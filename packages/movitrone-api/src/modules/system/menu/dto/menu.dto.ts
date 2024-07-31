import { ApiProperty, PartialType } from '@nestjs/swagger';
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

export class MenuDto extends OperatorDto {
  @ApiProperty({ description: 'Menu type' })
  @IsNotEmpty()
  @IsEnum(MENU_TYPES_ENUM)
  type: MENU_TYPES_ENUM;

  @ApiProperty({ description: 'Parent menu' })
  @IsNotEmpty()
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

  // @ApiProperty({ description: 'Is page cache enabled', default: 1 })
  // @ValidateIf((o: MenuDto) => o.type === 1)
  // @IsIn([0, 1])
  // keepAlive: number;

  @ApiProperty({ description: 'Corresponding permission' })
  @ValidateIf((o: MenuDto) => o.type === 2)
  @IsString()
  @IsOptional()
  permission: string;
}

export class MenuUpdateDto extends PartialType(MenuDto) {}

export class MenuQueryDto extends PartialType(MenuDto) {}
