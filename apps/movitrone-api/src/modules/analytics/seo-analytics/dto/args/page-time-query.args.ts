import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { TimeRangeArgs } from './timeRange-query.args';

export class PageTimeQueryDto extends TimeRangeArgs {
  @ApiProperty({
    description: 'website page',
    required: true,
    default: 'Home',
  })
  @IsNotEmpty()
  @IsString()
  page: string;
}
