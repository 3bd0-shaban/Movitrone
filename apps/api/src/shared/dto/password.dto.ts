import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class PasswordUpdateDto {
  @ApiProperty({ description: 'old password required' })
  @IsString()
  @Matches(/^[a-z0-9A-Z\W_]+$/)
  @MinLength(6)
  @MaxLength(20)
  oldPassword: string;

  @ApiProperty({ description: 'new password' })
  @Matches(/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Za-z])\S*$/, {
    message: '密码必须包含数字、字母，长度为6-16',
  })
  newPassword: string;
}

export class UserPasswordDto {
  @ApiProperty({ description: '更改后的密码' })
  @Matches(/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Za-z])\S*$/, {
    message: '密码格式不正确',
  })
  password: string;
}

export class UserExistDto {
  @ApiProperty({ description: '登录账号' })
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]{4,16}$/)
  @MinLength(6)
  @MaxLength(20)
  username: string;
}
