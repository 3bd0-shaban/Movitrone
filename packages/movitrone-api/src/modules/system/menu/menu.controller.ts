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
import { flattenDeep } from 'lodash';

import { ApiResult } from '~/common/decorators/api-result.decorator';
import { IdParam } from '~/common/decorators/id-param.decorator';
import { CreatorPipe } from '~/common/pipes/creator.pipe';
import { UpdaterPipe } from '~/common/pipes/updater.pipe';
import {
  Perm,
  definePermission,
  getDefinePermissions,
} from '~/modules/auth/decorator/permission.decorator';

import { MenuItemInfo } from './model/menu.model';
import { MenuService } from './menu.service';
import { JwtAdminGuard } from '~/modules/auth/guards/jwt-auth.guard';
import { CreateMenuDto, MenuQueryDto, MenuUpdateDto } from './dto';
import { Public } from '~/modules/auth/decorator/public.decorator';

export const permissions = definePermission('system:menu', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const);

@ApiTags('System - Menu permissions module')
@Controller('menus')
@UseGuards(JwtAdminGuard)
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: 'Get all menu list' })
  @ApiResult({ type: [MenuItemInfo] })
  @Perm(permissions.LIST)
  async list(@Query() dto: MenuQueryDto) {
    return this.menuService.list(dto);
  }

  @Get('get/:id')
  @ApiOperation({ summary: 'Get menu or permission information' })
  @Perm(permissions.READ)
  async info(@IdParam() id: number) {
    return this.menuService.getMenuItemAndParentInfo(id);
  }

  @Post()
  @ApiOperation({ summary: 'Add new menu or permission' })
  @Perm(permissions.CREATE)
  async create(@Body(CreatorPipe) dto: CreateMenuDto): Promise<void> {
    // check
    console.log(dto);
    await this.menuService.check(dto);
    if (!dto.parentId) dto.parentId = null;

    await this.menuService.create(dto);
    if (dto.type === 2) {
      // If permissions change, refresh all online user permissions
      await this.menuService.refreshOnlineUserPerms();
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update menu or permission' })
  @Perm(permissions.UPDATE)
  async update(
    @IdParam() id: number,
    @Body(UpdaterPipe) dto: MenuUpdateDto,
  ): Promise<void> {
    // check
    await this.menuService.check(dto);
    if (dto.parentId === -1 || !dto.parentId) dto.parentId = null;

    await this.menuService.update(id, dto);
    if (dto.type === 2) {
      // If permissions change, refresh all online user permissions
      await this.menuService.refreshOnlineUserPerms();
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete menu or permission' })
  @Perm(permissions.DELETE)
  async delete(@IdParam() id: number): Promise<void> {
    if (await this.menuService.checkRoleByMenuId(id))
      throw new BadRequestException(
        'This menu has associated roles and cannot be deleted',
      );

    // If there are child directories, delete them as well
    const childMenus = await this.menuService.findChildMenus(id);
    await this.menuService.deleteMenuItem(flattenDeep([id, childMenus]));
    // Refresh online user permissions
    await this.menuService.refreshOnlineUserPerms();
  }

  @Get('permissions')
  @Public()
  @ApiOperation({ summary: 'Get all backend-defined permission sets' })
  async getPermissions(): Promise<string[]> {
    return getDefinePermissions();
  }
}
