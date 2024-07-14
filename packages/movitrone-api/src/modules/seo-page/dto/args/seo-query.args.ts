import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, IsString, IsEnum } from 'class-validator';
import { SEO_PAGES_ENUM } from '../../seo-page.constant';

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
    default: SEO_PAGES_ENUM.HOME,
  })
  @IsNotEmpty()
  @IsEnum(SEO_PAGES_ENUM)
  page: SEO_PAGES_ENUM;
}
