import { IntersectionType, PartialType } from '@nestjs/swagger';
import { PagerDto } from '~/common/dto/pager.dto';
import { CreateRoleDto } from './role-create.dto';

export class RoleQueryDto extends IntersectionType(
  PagerDto<CreateRoleDto>,
  PartialType(CreateRoleDto),
) {}
