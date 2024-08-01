import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { LogService } from './log.service';
import { JwtAdminGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationArgs } from '~/shared/dto/args/pagination-query.args';
import { LogEntity } from './entities/log.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Logs')
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('all-logs')
  @UseGuards(JwtAdminGuard)
  async findAll(
    @Query() query: PaginationArgs,
  ): Promise<{ logs: LogEntity[]; total: number }> {
    return await this.logService.findAll(query);
  }
}
