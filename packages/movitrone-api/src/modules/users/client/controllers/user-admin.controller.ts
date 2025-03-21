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
import { ClientService } from '../user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from '~/shared/dto/create-user.dto';
import { ClientEntity } from '../entities/user.entity';
import { JwtAdminGuard } from '../../../auth/guards/jwt-auth.guard';
import { updateUserDTO } from '~/shared/dto/update-user.dto';
import { PasswordUpdateDto } from '~/shared/dto/password.dto';
import { LogService } from '../../../log/log.service';
import { definePermission } from '~/modules/auth/decorator/permission.decorator';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { LogMessage } from '~/common/decorators/log-message.decorator';
import { Pagination } from '~/helper/paginate/pagination';
import { PagerDto } from '~/common/dto/pager.dto';
import { LogInterceptor } from '~/common/interceptors/log.interceptor';

export const permissions = definePermission('system:client', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const);

@ApiTags('Website Users - Website Manpulation')
@Controller('a-user')
@UseGuards(JwtAdminGuard)
export class ClientAdminController {
  constructor(
    private readonly userService: ClientService,
    private readonly logService: LogService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Get admin self details' })
  @LogMessage('creating account')
  @UseInterceptors(LogInterceptor)
  create(@Body() createUserDto: CreateUserDTO) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get admin self details' })
  @ApiResult({ type: [ClientEntity], isPage: true })
  async findAll(@Query() query: PagerDto): Promise<Pagination<ClientEntity>> {
    return await this.userService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get admin self details' })
  @ApiResult({ type: ClientEntity })
  findOne(@Param('id') id: number): Promise<ClientEntity> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Get admin self details' })
  @LogMessage('updateing user details by id')
  @UseInterceptors(LogInterceptor)
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: updateUserDTO,
  ): Promise<void> {
    await this.userService.update(id, updateUserDto);
  }

  @Put(':id/password')
  @ApiOperation({ summary: 'Get admin self details' })
  @LogMessage('updating user password')
  @UseInterceptors(LogInterceptor)
  async updatePassword(
    @Param('id') id: number,
    @Body() inputs: PasswordUpdateDto,
  ): Promise<void> {
    await this.userService.updatePasswordById(id, inputs);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Get admin self details' })
  @LogMessage('Deleting account')
  @UseInterceptors(LogInterceptor)
  remove(@Param('id') id: number): Promise<void> {
    return this.userService.removeById(id);
  }
}
