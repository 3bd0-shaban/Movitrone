import { CommonEntity, CompleteEntity } from '~/common/entity/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AdminEntity } from '~/modules/users/admin/entities/admin.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'logs' })
export class LogEntity extends CompleteEntity {
  @Column()
  @ApiProperty({ description: 'log message content' })
  content: string;

  @ManyToOne(() => AdminEntity, (admin) => admin.logs)
  @JoinColumn({ name: 'admin_id' })
  @ApiProperty({ description: 'user who committed the action' })
  admin: AdminEntity;
}
