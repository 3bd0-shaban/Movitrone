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
} from '@nestjs/common';
import { ClientService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from '~/shared/dto/inputs/create-user.dto';
import { PaginationArgs } from '~/shared/dto/args/pagination-query.args';
import { ClientEntity } from './entities/user.entity';
import { JwtAdminGuard, JwtUserGuard } from '../../auth/guards/jwt-auth.guard';
import { updateUserDTO } from '~/shared/dto/inputs/update-user.dto';
import { DashboardGuard } from '../../auth/guards/dashboard.guard';
import { CurrentUser } from '../../auth/decorator/auth-user.decorator';
import { PasswordUpdateDto } from '~/shared/dto/inputs/password.dto';
import { LogService } from '../../log/log.service';

@ApiTags('Website Users - Website Manpulation')
@ApiBearerAuth()
@Controller('user')
export class ClientController {
  constructor(
    private readonly userService: ClientService,
    private readonly logService: LogService,
  ) {}

  //Self Users API methods ( for website )
  @Get('get/self')
  @UseGuards(JwtUserGuard)
  findSelf(@CurrentUser() user: ClientEntity): Promise<ClientEntity> {
    return this.userService.findOne(user.id);
  }

  @Put('update/self')
  @UseGuards(JwtUserGuard)
  async updateSelf(
    @CurrentUser() user: ClientEntity,
    @Body() updateUserDto: updateUserDTO,
  ): Promise<string> {
    await this.userService.update(user.id, updateUserDto);
    return 'ok';
  }

  @Put('update/self/password')
  @UseGuards(JwtUserGuard)
  async updateSelfPassword(
    @CurrentUser() user: ClientEntity,
    @Body() inputs: PasswordUpdateDto,
  ): Promise<string> {
    await this.userService.updatePasswordById(user.id, inputs);
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
  ): Promise<{ users: ClientEntity[]; total: number }> {
    return await this.userService.findAll(query);
  }

  @Get('get-by-id/:id')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  findOne(@Param('id') id: number): Promise<ClientEntity> {
    return this.userService.findOne(id);
  }

  @Put('update-by-id/:id')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: updateUserDTO,
  ): Promise<string> {
    await this.userService.update(id, updateUserDto);
    return 'ok';
  }

  @Put('update-by-id/:id/password')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async updatePassword(
    @Param('id') id: number,
    @Body() inputs: PasswordUpdateDto,
  ): Promise<string> {
    await this.userService.updatePasswordById(id, inputs);
    return 'ok';
  }

  @Delete('delete-by-id/:id')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  remove(@Param('id') id: number): Promise<void> {
    return this.userService.removeById(id);
  }
}
