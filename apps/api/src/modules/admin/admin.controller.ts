import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationArgs } from 'src/shared/dto/args/pagination-query.args';
import { JwtAdminGuard } from '../auth/guards/jwt-auth.guard';
import { updateUserDTO } from 'src/shared/dto/update-user.dto';
import { DashboardGuard } from '../auth/guards/dashboard.guard';
import { CurrentUser } from '../auth/decorator/auth-user.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminService } from './admin.service';
import { AdminEntity } from './entities/admin.entity';
import { PasswordUpdateDto } from 'src/shared/dto/password.dto';
import { LogService } from '../log/log.service';

@ApiTags('Admin - Dashboard Manpulation')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly logService: LogService,
  ) {}

  //Self Users API methods ( for website )
  @Get('get/self')
  @UseGuards(JwtAdminGuard)
  findSelf(@CurrentUser() user: AdminEntity): Promise<AdminEntity> {
    return this.adminService.findOne(+user.id);
  }

  @Patch('update/self')
  @UseGuards(JwtAdminGuard)
  async updateSelf(
    @CurrentUser() user: AdminEntity,
    @Body() updateUserDto: updateUserDTO,
  ): Promise<string> {
    await this.adminService.update(+user.id, updateUserDto);
    await this.logService.create('updated his account details', user);
    return 'ok';
  }

  @Patch('update/self/password')
  @UseGuards(JwtAdminGuard)
  async updateSelfPassword(
    @CurrentUser() user: AdminEntity,
    @Body() inputs: PasswordUpdateDto,
  ): Promise<string> {
    await this.adminService.updatePasswordById(+user.id, inputs);
    await this.logService.create('updated his account password', user);
    return 'ok';
  }

  //admin API methods to control users ( for dashbaord )
  @Post('create-user')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async create(
    @CurrentUser() user: AdminEntity,
    @Body() inputs: CreateAdminDto,
  ) {
    const admin = await this.adminService.create(inputs);
    await this.logService.create('updated his account details', user);
    return admin;
  }

  @Get('all-users')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async findAll(
    @Query() query: PaginationArgs,
  ): Promise<{ users: AdminEntity[]; total: number }> {
    return await this.adminService.findAll(query);
  }

  @Get('get-by-id/:id')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  findOne(@Param('id') id: string): Promise<AdminEntity> {
    return this.adminService.findOne(+id);
  }

  @Patch('update-by-id/:id')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async update(
    @Param('id') id: string,
    @CurrentUser() user: AdminEntity,
    @Body() updateUserDto: updateUserDTO,
  ): Promise<string> {
    const updatedUser = await this.adminService.update(+id, updateUserDto);
    await this.logService.create(`updated his account`, user);
    return 'ok';
  }

  @Patch('update-by-id/:id/password')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async updatePassword(
    @Param('id') id: string,
    @CurrentUser() user: AdminEntity,
    @Body() inputs: PasswordUpdateDto,
  ): Promise<string> {
    await this.adminService.updatePasswordById(+id, inputs);
    await this.logService.create('updated his account details', user);

    return 'ok';
  }

  @Delete('delete-by-id/:id')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AdminEntity,
  ): Promise<void> {
    const removed = await this.adminService.removeById(+id);
    await this.logService.create('updated his account details', user);
    return removed;
  }
}
