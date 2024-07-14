import {
  IsNotEmpty,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  ArrayMinSize,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SEO_PAGES_ENUM, SEO_STATUS_ENUM } from '../seo-page.constant';

export class CreateSeoPageDto {
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
  @IsEnum(SEO_PAGES_ENUM)
  page: SEO_PAGES_ENUM;

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
}
