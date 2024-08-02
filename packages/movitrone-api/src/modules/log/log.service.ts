import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogEntity } from './entities/log.entity';
import { Repository } from 'typeorm';
import { AdminEntity } from '../users/admin/entities/admin.entity';
import { paginate } from '~/helper/paginate';
import { PagerDto } from '~/common/dto/pager.dto';
import { Pagination } from '~/helper/paginate/pagination';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>,
  ) {}

  /**
   * Create a new log action
   *
   * @param {string} content - Log content
   * @param {AdminEntity} admin - Admin entity
   * @returns {Promise<LogEntity>} - The created log entity
   */
  async create(content: string, admin: AdminEntity): Promise<LogEntity> {
    const log = this.logRepository.create({ content, admin });
    return await log.save();
  }

  /**
   * find all logs action
   *
   * @param {PagerDto} pagination - pagination inputs
   */
  async findAll({ page, pageSize }: PagerDto): Promise<Pagination<LogEntity>> {
    const queryBuilder = this.logRepository.createQueryBuilder('admin');
    return paginate<LogEntity>(queryBuilder, { page, pageSize });
  }
}
