import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOTPDTOs {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  otp: string;
}
