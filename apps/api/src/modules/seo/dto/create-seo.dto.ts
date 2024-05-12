import {
  IsNotEmpty,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  IsBoolean,
  Matches,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SEO_STATUS_ENUM } from '../seo.constant';

export class CreateSeoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tag_Title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  tag_Description: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}$/, {
    message: 'Invalid country code format. It should be two uppercase letters.',
  })
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  page: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  canonical_Url: string;

  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  keywoprds: string[];

  @ApiProperty({ enum: SEO_STATUS_ENUM })
  @IsNotEmpty()
  @IsEnum(SEO_STATUS_ENUM)
  Seo_Status: SEO_STATUS_ENUM;

  @ApiProperty({ default: true })
  @IsBoolean()
  is_Active?: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  is_Main?: boolean;
}
