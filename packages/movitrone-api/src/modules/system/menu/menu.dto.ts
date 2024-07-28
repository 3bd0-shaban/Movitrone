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

  @ApiProperty({ description: 'Order' })
  @IsInt()
  @Min(0)
  orderNo: number;

  @ApiProperty({ description: 'Frontend route address' })
  // @Matches(/^[/]$/)
  @ValidateIf((o) => o.type !== 2)
  path: string;

  @ApiProperty({ description: 'Is external link', default: false })
  @ValidateIf((o) => o.type !== 2)
  @IsBoolean()
  isExt: boolean;

  @ApiProperty({ description: 'External link open mode', default: 1 })
  @ValidateIf((o: MenuDto) => o.isExt)
  @IsIn([1, 2])
  extOpenMode: number;

  @ApiProperty({ description: 'Is menu displayed', default: 1 })
  @ValidateIf((o: MenuDto) => o.type !== 2)
  @IsIn([0, 1])
  show: number;

  @ApiProperty({
    description:
      'Sets the currently highlighted menu item, generally used for detail pages',
  })
  @ValidateIf((o: MenuDto) => o.type !== 2 && o.show === 0)
  @IsString()
  @IsOptional()
  activeMenu?: string;

  @ApiProperty({ description: 'Is page cache enabled', default: 1 })
  @ValidateIf((o: MenuDto) => o.type === 1)
  @IsIn([0, 1])
  keepAlive: number;

  @ApiProperty({ description: 'Status', default: 1 })
  @IsIn([0, 1])
  status: number;

  @ApiProperty({ description: 'Menu icon' })
  @IsOptional()
  @ValidateIf((o: MenuDto) => o.type !== 2)
  @IsString()
  icon?: string;

  @ApiProperty({ description: 'Corresponding permission' })
  @ValidateIf((o: MenuDto) => o.type === 2)
  @IsString()
  @IsOptional()
  permission: string;

  @ApiProperty({ description: 'Menu route path or external link' })
  @ValidateIf((o: MenuDto) => o.type !== 2)
  @IsString()
  @IsOptional()
  component?: string;
}

export class MenuUpdateDto extends PartialType(MenuDto) {}

export class MenuQueryDto extends PartialType(MenuDto) {}
