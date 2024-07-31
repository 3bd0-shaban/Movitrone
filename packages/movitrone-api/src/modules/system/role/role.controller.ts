import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Put,
  Query,
  UseGuards,
  forwardRef,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiResult } from '~/common/decorators/api-result.decorator';
import { IdParam } from '~/common/decorators/id-param.decorator';
import { ApiSecurityAuth } from '~/common/decorators/swagger.decorator';
import { UpdaterPipe } from '~/common/pipes/updater.pipe';

// import { SseService } from '~/modules/sse/sse.service';
import { RoleEntity } from '~/modules/system/role/entity/role.entity';

import { MenuService } from '../menu/menu.service';

import { RoleDto, RoleQueryDto, RoleUpdateDto } from './dto/role.dto';
import { RoleInfo } from './model/role.model';
import { RoleService } from './role.service';
import {
  definePermission,
  Perm,
} from '~/modules/auth/decorator/permission.decorator';
import { JwtAdminGuard } from '~/modules/auth/guards/jwt-auth.guard';

export const permissions = definePermission('system:role', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const);

@ApiTags('System - Role module')
@ApiBearerAuth()
@Controller('roles')
export class RoleController {
  constructor(
    private roleService: RoleService,
    private menuService: MenuService,
    // @Inject(forwardRef(() => SseService))
    // private sseService: SseService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get role list' })
  @ApiResult({ type: [RoleEntity], isPage: true })
  @UseGuards(JwtAdminGuard)
  @Perm(permissions.LIST)
  async list(@Query() dto: RoleQueryDto) {
    return this.roleService.list(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role information' })
  @ApiResult({ type: RoleInfo })
  @UseGuards(JwtAdminGuard)
  @Perm(permissions.READ)
  async info(@IdParam() id: number) {
    return this.roleService.RoleById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Add new role' })
  @UseGuards(JwtAdminGuard)
  @Perm(permissions.CREATE)
  async create(@Body() dto: RoleDto): Promise<void> {
    await this.roleService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update role' })
  @UseGuards(JwtAdminGuard)
  @Perm(permissions.UPDATE)
  async update(
    @IdParam() id: number,
    @Body(UpdaterPipe) dto: RoleUpdateDto,
  ): Promise<void> {
    await this.roleService.update(id, dto);
    await this.menuService.refreshOnlineUserPerms(false);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete role' })
  @UseGuards(JwtAdminGuard)
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
