import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class PasswordUpdateDto {
  @ApiProperty({ description: 'old password required' })
  @IsString()
  @Matches(/^[a-z0-9A-Z\W_]+$/)
  @MinLength(6)
  @MaxLength(50)
  oldPassword: string;

  @ApiProperty({ description: 'new password' })
  @Matches(/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Za-z])\S*$/, {
    message:
      'The password must contain numbers and letters, and be 6-50 characters in length.',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  newPassword: string;
}
