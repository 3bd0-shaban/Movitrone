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
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/shared/dto/create-user.dto';
import { PaginationArgs } from 'src/shared/dto/args/pagination-query.args';
import { UserEntity } from './entities/user.entity';
import { JwtAdminGuard, JwtUserGuard } from '../auth/guards/jwt-auth.guard';
import { updateUserDTO } from 'src/shared/dto/update-user.dto';
import { DashboardGuard } from '../auth/guards/dashboard.guard';
import { CurrentUser } from '../auth/decorator/auth-user.decorator';
import { PasswordUpdateDto } from 'src/shared/dto/password.dto';
import { LogService } from '../log/log.service';
import { AdminEntity } from '../admin/entities/admin.entity';

@ApiTags('Website Users - Website Manpulation')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logService: LogService,
  ) {}

  //Self Users API methods ( for website )
  @Get('get/self')
  @UseGuards(JwtUserGuard)
  findSelf(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    return this.userService.findOne(+user.id);
  }

  @Patch('update/self')
  @UseGuards(JwtUserGuard)
  async updateSelf(
    @CurrentUser() user: UserEntity,
    @Body() updateUserDto: updateUserDTO,
  ): Promise<string> {
    await this.userService.update(+user.id, updateUserDto);
    return 'ok';
  }

  @Patch('update/self/password')
  @UseGuards(JwtUserGuard)
  async updateSelfPassword(
    @CurrentUser() user: UserEntity,
    @Body() inputs: PasswordUpdateDto,
  ): Promise<string> {
    await this.userService.updatePasswordById(+user.id, inputs);
    return 'ok';
  }

  //admin API methods to control users ( for dashbaord )
  @Post('create-user')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  create(@Body() createUserDto: CreateUserDTO) {
    return this.userService.create(createUserDto);
  }

  @Get('all-users')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async findAll(
    @Query() query: PaginationArgs,
  ): Promise<{ users: UserEntity[]; total: number }> {
    return await this.userService.findAll(query);
  }

  @Get('get-by-id/:id')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findOne(+id);
  }

  @Patch('update-by-id/:id')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: updateUserDTO,
  ): Promise<string> {
    await this.userService.update(+id, updateUserDto);
    return 'ok';
  }

  @Patch('update-by-id/:id/password')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async updatePassword(
    @Param('id') id: string,
    @Body() inputs: PasswordUpdateDto,
  ): Promise<string> {
    await this.userService.updatePasswordById(+id, inputs);
    return 'ok';
  }

  @Delete('delete-by-id/:id')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.removeById(+id);
  }
}
