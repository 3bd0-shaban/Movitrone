import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CreateUserDTO } from '~/shared/dto/inputs/create-user.dto';
import { ADMIN_ROLES_ENUMS } from '../admin.constant';

export class CreateAdminDto extends CreateUserDTO {
  @ApiProperty({ description: 'phone number' })
  @IsNotEmpty()
  @IsEnum(ADMIN_ROLES_ENUMS)
  role: string;
}
