import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsISO8601 } from 'class-validator';

export class TimeRangeArgs {
  @ApiProperty({
    description: 'Start date (ISO 8601 format)',
    required: true,
    default: '2024-01-01',
  })
  @IsNotEmpty()
  // @IsISO8601()
  startDate: Date;

  @ApiProperty({
    description: 'End date (ISO 8601 format)',
    required: true,
    default: '2024-12-31',
  })
  @IsNotEmpty()
  // @IsISO8601()
  endDate: Date;
}
