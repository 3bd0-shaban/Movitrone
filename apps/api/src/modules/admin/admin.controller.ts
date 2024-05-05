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
import { ApiTags } from '@nestjs/swagger';
import { PaginationArgs } from 'src/shared/dto/args/pagination-query.args';
import { JwtUserGuard } from '../auth/guards/jwt-auth.guard';
import { updateUserDTO } from 'src/shared/dto/update-user.dto';
import { DashboardGuard } from '../auth/guards/dashboard.guard';
import { CurrentUser } from '../auth/decorator/auth-user.decorator';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminService } from './admin.service';
import { AdminEntity } from './entities/admin.entity';

@ApiTags('Admin - Dashboard Manpulation')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() inputs: CreateAdminDto) {
    return this.adminService.create(inputs);
  }

  //Self Users API methods ( for website )
  @Get('get/self')
  @UseGuards(JwtUserGuard)
  findSelf(@CurrentUser() user: AdminEntity): Promise<AdminEntity> {
    return this.adminService.findOne(+user.id);
  }

  @Patch('update/self')
  @UseGuards(JwtUserGuard)
  updateSelf(
    @CurrentUser() user: AdminEntity,
    @Body() updateUserDto: updateUserDTO,
  ): Promise<AdminEntity> {
    return this.adminService.updateById(+user.id, updateUserDto);
  }

  //admin API methods to control users ( for dashbaord )
  @Get('all-users')
  @UseGuards(JwtUserGuard, DashboardGuard)
  async findAll(
    @Query() query: PaginationArgs,
  ): Promise<{ users: AdminEntity[]; total: number }> {
    return await this.adminService.findAll(query);
  }

  @Get('get/:id')
  @UseGuards(JwtUserGuard, DashboardGuard)
  findOne(@Param('id') id: string): Promise<AdminEntity> {
    return this.adminService.findOne(+id);
  }

  @Patch('update/:id')
  @UseGuards(JwtUserGuard, DashboardGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: updateUserDTO,
  ): Promise<AdminEntity> {
    return this.adminService.updateById(+id, updateUserDto);
  }

  @Delete('delete/:id')
  @UseGuards(JwtUserGuard, DashboardGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.adminService.removeById(+id);
  }
}
