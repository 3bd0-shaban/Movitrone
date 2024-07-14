import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateSeoCountryDto {
  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}$/, {
    message: 'Invalid country code format. It should be two uppercase letters.',
  })
  country: string;
}
