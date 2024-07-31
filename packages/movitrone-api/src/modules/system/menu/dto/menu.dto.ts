import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

import { OperatorDto } from '~/common/dto/operator.dto';

export class MenuDto extends OperatorDto {
  @ApiProperty({ description: 'Menu type' })
  @IsIn([0, 1, 2])
  type: number;

  @ApiProperty({ description: 'Parent menu' })
  @IsOptional()
  parentId: number;

  @ApiProperty({ description: 'Menu or permission name' })
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
