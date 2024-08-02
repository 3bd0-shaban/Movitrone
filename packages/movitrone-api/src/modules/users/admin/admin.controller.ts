import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAdminGuard } from '../../auth/guards/jwt-auth.guard';
import { updateUserDTO } from '~/shared/dto/update-user.dto';
import { CurrentUser } from '../../auth/decorator/auth-user.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminService } from './admin.service';
import { AdminEntity } from './entities/admin.entity';
import { PasswordUpdateDto } from '~/shared/dto/password.dto';
import { LogService } from '../../log/log.service';
import { ADMIN_ROLES_ENUMS } from './admin.constant';
import { definePermission } from '~/modules/auth/decorator/permission.decorator';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { CreatorPipe } from '~/common/pipes/creator.pipe';
import { LogMessage } from '~/common/decorators/log-message.decorator';
import { LogInterceptor } from '~/common/interceptors/log.interceptor';
import { Pagination } from '~/helper/paginate/pagination';
import { PagerDto } from '~/common/dto/pager.dto';
import { AccountMenus } from './dto/menus.args';

export const permissions = definePermission('system:users:dashboard', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const);

@ApiTags('Admin - Dashboard Manpulation')
@Controller('admin')
@UseGuards(JwtAdminGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly logService: LogService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get admin self details' })
  @ApiResult({ type: AdminEntity })
  async findSelf(@CurrentUser() user: AdminEntity): Promise<AdminEntity> {
    return this.adminService.findOne(user.id);
  }

  @Put()
  @ApiOperation({ summary: 'update admin self details' })
  @LogMessage('updating self account details')
  @UseInterceptors(LogInterceptor)
  async updateSelf(
    @CurrentUser() user: AdminEntity,
    @Body(CreatorPipe) updateUserDto: updateUserDTO,
  ): Promise<void> {
    await this.adminService.update(user.id, updateUserDto);
  }

  @Put('account/password')
  @ApiOperation({ summary: 'update self account details' })
  @LogMessage('updating account password')
  @UseInterceptors(LogInterceptor)
  async updateSelfPassword(
    @CurrentUser() user: AdminEntity,
    @Body() inputs: PasswordUpdateDto,
  ): Promise<void> {
    await this.adminService.updatePasswordById(user.id, inputs);
  }

  @Get('account/menus')
  @ApiOperation({ summary: 'Get menu list' })
  @ApiResult({ type: [AccountMenus] })
  async menu(@CurrentUser() user: AdminEntity) {
    return this.adminService.getMenus(user.id);
  }

  @Get('account/permissions')
  @ApiOperation({ summary: 'Get permission list' })
  @ApiResult({ type: [String] })
  async permissions(@CurrentUser() user: AdminEntity): Promise<string[]> {
    return this.adminService.getPermissions(user.id);
  }

  //admin API methods to control users ( for dashbaord )
  @Post()
  @ApiOperation({ summary: 'create user' })
  @LogMessage('creating account')
  @UseInterceptors(LogInterceptor)
  async create(
    @CurrentUser() user: AdminEntity,
    @Body() inputs: CreateAdminDto,
  ) {
    await this.adminService.create(inputs);
  }

  @Get('role/:role')
  @ApiOperation({ summary: 'Get users by role' })
  @ApiResult({ type: [AdminEntity], isPage: true })
  async findAll(
    @Query() query: PagerDto,
    @Param('role') role: ADMIN_ROLES_ENUMS,
  ): Promise<Pagination<AdminEntity>> {
    return await this.adminService.findAll({ ...query, role });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResult({ type: AdminEntity })
  findOne(@Param('id') id: number): Promise<AdminEntity> {
    return this.adminService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'update user by id' })
  @LogMessage('updateing user details by id')
  @UseInterceptors(LogInterceptor)
  async update(
    @Param('id') id: number,
    @Body(CreatorPipe) updateUserDto: updateUserDTO,
  ): Promise<void> {
    await this.adminService.update(id, updateUserDto);
  }

  @Put(':id/password')
  @ApiOperation({ summary: 'update user password' })
  @LogMessage('updating user password')
  @UseInterceptors(LogInterceptor)
  async updatePassword(
    @Param('id') id: number,
    @Body(CreatorPipe) inputs: PasswordUpdateDto,
  ): Promise<void> {
    await this.adminService.updatePasswordById(id, inputs);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete user account' })
  @LogMessage('Deleting account')
  @UseInterceptors(LogInterceptor)
  async remove(@Param('id') id: number): Promise<void> {
    await this.adminService.removeById(id);
  }
}
