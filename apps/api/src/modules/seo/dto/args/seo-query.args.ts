import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  Min,
  Max,
  IsOptional,
  IsNotEmpty,
  Matches,
  IsString,
} from 'class-validator';

export class SeoWebsitePages {
  @ApiProperty({
    description: 'Country code',
    required: true,
    default: 'EG',
  })
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}$/, {
    message: 'Invalid country code format. It should be two uppercase letters.',
  })
  code: string;

  @ApiProperty({
    description: 'website page',
    required: true,
    default: 'Home',
  })
  @IsNotEmpty()
  @IsString()
  page: string;
}
