import {
  Controller,
  Get,
  Body,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientService } from '../user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientEntity } from '../entities/user.entity';
import { JwtUserGuard } from '../../../auth/guards/jwt-auth.guard';
import { updateUserDTO } from '~/shared/dto/inputs/update-user.dto';
import { CurrentUser } from '../../../auth/decorator/auth-user.decorator';
import { PasswordUpdateDto } from '~/shared/dto/inputs/password.dto';
import { LogService } from '../../../log/log.service';
import { definePermission } from '~/modules/auth/decorator/permission.decorator';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { LogMessage } from '~/common/decorators/log-message.decorator';

import { LogInterceptor } from '~/common/interceptors/log.interceptor';

export const permissions = definePermission('system:users:dashboard', {
  LIST: 'list',
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const);

@ApiTags('Website Users - Admin Control')
@Controller('user')
@UseGuards(JwtUserGuard)
export class ClientController {
  constructor(
    private readonly userService: ClientService,
    private readonly logService: LogService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get admin self details' })
  @ApiResult({ type: ClientEntity })
  findSelf(@CurrentUser() user: ClientEntity): Promise<ClientEntity> {
    return this.userService.findOne(user.id);
  }

  @Put()
  @ApiOperation({ summary: 'Get admin self details' })
  @LogMessage('updating self account details')
  @UseInterceptors(LogInterceptor)
  async updateSelf(
    @CurrentUser() user: ClientEntity,
    @Body() updateUserDto: updateUserDTO,
  ): Promise<void> {
    await this.userService.update(user.id, updateUserDto);
  }

  @Put('password')
  @ApiOperation({ summary: 'Get admin self details' })
  @LogMessage('updating account password')
  @UseInterceptors(LogInterceptor)
  async updateSelfPassword(
    @CurrentUser() user: ClientEntity,
    @Body() inputs: PasswordUpdateDto,
  ): Promise<void> {
    await this.userService.updatePasswordById(user.id, inputs);
  }
}
