import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
  isEmpty,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ description: '登录密码', example: '123-456*' })
  @IsOptional()
  @Matches(/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Za-z])\S*$/, {
    message:
      'The password must contain numbers and letters, and be 6-16 characters in length',
  })
  password: string;

  @ApiProperty({ description: 'Email', example: 'bqy.dev@qq.com' })
  @IsEmail()
  @ValidateIf((o) => !isEmpty(o.email))
  email: string;

  @ApiProperty({ description: 'phone number' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ description: 'phone number' })
  @IsNotEmpty()
  @IsString()
  code?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(11)
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(11)
  lastname: string;
}
