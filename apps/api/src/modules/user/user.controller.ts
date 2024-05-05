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
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from 'src/shared/dto/create-user.dto';
import { PaginationArgs } from 'src/shared/dto/args/pagination-query.args';
import { UserEntity } from './entities/user.entity';
import { JwtAdminGuard, JwtUserGuard } from '../auth/guards/jwt-auth.guard';
import { updateUserDTO } from 'src/shared/dto/update-user.dto';
import { DashboardGuard } from '../auth/guards/dashboard.guard';
import { CurrentUser } from '../auth/decorator/auth-user.decorator';

@ApiTags('Website Users - Website Manpulation')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDTO) {
    return this.userService.create(createUserDto);
  }

  //Self Users API methods ( for website )
  @Get('get/self')
  @UseGuards(JwtUserGuard)
  findSelf(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    return this.userService.findOne(+user.id);
  }

  @Patch('update/self')
  @UseGuards(JwtUserGuard)
  updateSelf(
    @CurrentUser() user: UserEntity,
    @Body() updateUserDto: updateUserDTO,
  ): Promise<UserEntity> {
    return this.userService.updateById(+user.id, updateUserDto);
  }

  //admin API methods to control users ( for dashbaord )
  @Get('all-users')
  @UseGuards(JwtAdminGuard, DashboardGuard)
  async findAll(
    @Query() query: PaginationArgs,
  ): Promise<{ users: UserEntity[]; total: number }> {
    return await this.userService.findAll(query);
  }

  @Get('get/:id')
  @UseGuards(JwtUserGuard, DashboardGuard)
  findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findOne(+id);
  }

  @Patch('update/:id')
  @UseGuards(JwtUserGuard, DashboardGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: updateUserDTO,
  ): Promise<UserEntity> {
    return this.userService.updateById(+id, updateUserDto);
  }

  @Delete('delete/:id')
  @UseGuards(JwtUserGuard, DashboardGuard)
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.removeById(+id);
  }
}
