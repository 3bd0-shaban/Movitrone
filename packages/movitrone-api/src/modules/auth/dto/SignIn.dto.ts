import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Email of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
