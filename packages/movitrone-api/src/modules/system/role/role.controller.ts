import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiResult } from '~/common/decorators/api-result.decorator';
import { IdParam } from '~/common/decorators/id-param.decorator';
import { UpdaterPipe } from '~/common/pipes/updater.pipe';
import { RoleEntity } from '~/modules/system/role/entity/role.entity';
import { MenuService } from '../menu/menu.service';
import { RoleInfo } from './model/role.model';
import { RoleService } from './role.service';
import {
  definePermission,
  Perm,
} from '~/modules/auth/decorator/permission.decorator';
import { JwtAdminGuard } from '~/modules/auth/guards/jwt-auth.guard';
import { RoleQueryDto, CreateRoleDto, UpdateRoleDto } from './dto';
import { CreatorPipe } from '~/common/pipes/creator.pipe';

export const permissions = definePermission('system:role', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const);

@ApiTags('System - Role module')
@Controller('roles')
@UseGuards(JwtAdminGuard)
export class RoleController {
  constructor(
    private roleService: RoleService,
    private menuService: MenuService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get role list' })
  @ApiResult({ type: [RoleEntity], isPage: true })
  @Perm(permissions.LIST)
  async list(@Query() dto: RoleQueryDto) {
    return this.roleService.list(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role information' })
  @ApiResult({ type: RoleInfo })
  @Perm(permissions.READ)
  async info(@IdParam() id: number) {
    return this.roleService.RoleById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Add new role' })
  @Perm(permissions.CREATE)
  async create(@Body(CreatorPipe) dto: CreateRoleDto): Promise<void> {
    await this.roleService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update role' })
  @Perm(permissions.UPDATE)
  async update(
    @IdParam() id: number,
    @Body(UpdaterPipe) dto: UpdateRoleDto,
  ): Promise<void> {
    await this.roleService.update(id, dto);
    await this.menuService.refreshOnlineUserPerms(false);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete role' })
  @Perm(permissions.DELETE)
  async delete(@IdParam() id: number): Promise<void> {
    if (await this.roleService.checkUserByRoleId(id))
      throw new BadRequestException(
        'The role has associated users and cannot be deleted',
      );

    await this.roleService.delete(id);
    await this.menuService.refreshOnlineUserPerms(false);
  }
}
