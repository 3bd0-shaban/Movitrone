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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAdminGuard } from '../../auth/guards/jwt-auth.guard';
import { updateUserDTO } from '~/shared/dto/inputs/update-user.dto';
import { CurrentUser } from '../../auth/decorator/auth-user.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminService } from './admin.service';
import { AdminEntity } from './entities/admin.entity';
import { PasswordUpdateDto } from '~/shared/dto/inputs/password.dto';
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
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly logService: LogService,
  ) {}

  @Get('self')
  @ApiOperation({ summary: 'Get admin self details' })
  @ApiResult({ type: AdminEntity })
  @UseGuards(JwtAdminGuard)
  async findSelf(@CurrentUser() user: AdminEntity): Promise<AdminEntity> {
    return this.adminService.findOne(user.id);
  }

  @Put('self')
  @ApiOperation({ summary: 'update admin self details' })
  @UseGuards(JwtAdminGuard)
  @LogMessage('updating self account details')
  @UseInterceptors(LogInterceptor)
  async updateSelf(
    @CurrentUser() user: AdminEntity,
    @Body(CreatorPipe) updateUserDto: updateUserDTO,
  ): Promise<void> {
    await this.adminService.update(user.id, updateUserDto);
  }

  @Put('self/password')
  @ApiOperation({ summary: 'update self account details' })
  @UseGuards(JwtAdminGuard)
  @LogMessage('updating account password')
  @UseInterceptors(LogInterceptor)
  async updateSelfPassword(
    @CurrentUser() user: AdminEntity,
    @Body() inputs: PasswordUpdateDto,
  ): Promise<void> {
    await this.adminService.updatePasswordById(user.id, inputs);
  }

  @Get('menus')
  @ApiOperation({ summary: 'Get menu list' })
  @ApiResult({ type: [AccountMenus] })
  async menu(@CurrentUser() user: AdminEntity) {
    return this.adminService.getMenus(user.id);
  }

  @Get('permissions')
  @ApiOperation({ summary: 'Get permission list' })
  @ApiResult({ type: [String] })
  async permissions(@CurrentUser() user: AdminEntity): Promise<string[]> {
    return this.adminService.getPermissions(user.id);
  }

  //admin API methods to control users ( for dashbaord )
  @Post('create-user')
  @ApiOperation({ summary: 'create user' })
  @UseGuards(JwtAdminGuard)
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
  @UseGuards(JwtAdminGuard)
  async findAll(
    @Query() query: PagerDto,
    @Param('role') role: ADMIN_ROLES_ENUMS,
  ): Promise<Pagination<AdminEntity>> {
    return await this.adminService.findAll({ ...query, role });
  }

  @Get('user-id/:id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResult({ type: AdminEntity })
  @UseGuards(JwtAdminGuard)
  findOne(@Param('id') id: number): Promise<AdminEntity> {
    return this.adminService.findOne(id);
  }

  @Put('user-id/:id')
  @ApiOperation({ summary: 'update user by id' })
  @UseGuards(JwtAdminGuard)
  @LogMessage('updateing user details by id')
  @UseInterceptors(LogInterceptor)
  async update(
    @Param('id') id: number,
    @Body(CreatorPipe) updateUserDto: updateUserDTO,
  ): Promise<void> {
    await this.adminService.update(id, updateUserDto);
  }

  @Put('userid/:id/password')
  @ApiOperation({ summary: 'update user password' })
  @UseGuards(JwtAdminGuard)
  @LogMessage('updating user password')
  @UseInterceptors(LogInterceptor)
  async updatePassword(
    @Param('id') id: number,
    @Body(CreatorPipe) inputs: PasswordUpdateDto,
  ): Promise<void> {
    await this.adminService.updatePasswordById(id, inputs);
  }

  @Delete('user-id/:id')
  @ApiOperation({ summary: 'delete user account' })
  @LogMessage('Deleting account')
  @UseInterceptors(LogInterceptor)
  @UseGuards(JwtAdminGuard)
  async remove(@Param('id') id: number): Promise<void> {
    await this.adminService.removeById(id);
  }
}
