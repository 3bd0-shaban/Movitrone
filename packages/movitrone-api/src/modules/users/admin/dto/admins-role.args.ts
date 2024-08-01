import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ADMIN_ROLES_ENUMS } from '../admin.constant';

export class AdminsRoleArgs {
  @ApiProperty({
    required: true,
    description: 'dashboard user role',
    enum: ADMIN_ROLES_ENUMS,
    default: ADMIN_ROLES_ENUMS.admin,
  })
  @IsNotEmpty()
  @IsEnum(ADMIN_ROLES_ENUMS)
  role: ADMIN_ROLES_ENUMS;
}
