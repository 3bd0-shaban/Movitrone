import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { LogService } from './log.service';
import { JwtAdminGuard } from '../auth/guards/jwt-auth.guard';
import { LogEntity } from './entities/log.entity';
import { ApiTags } from '@nestjs/swagger';
import { Pagination } from '~/helper/paginate/pagination';
import { ApiResult } from '~/common/decorators/api-result.decorator';
import { PagerDto } from '~/common/dto/pager.dto';

@ApiTags('Logs')
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('all-logs')
  @UseGuards(JwtAdminGuard)
  @ApiResult({ type: LogEntity, isPage: true })
  async findAll(@Query() query: PagerDto): Promise<Pagination<LogEntity>> {
    return await this.logService.findAll(query);
  }
}
