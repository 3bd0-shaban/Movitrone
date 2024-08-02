import { CommonEntity } from '~/common/entity/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AdminEntity } from '~/modules/users/admin/entities/admin.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'logs' })
export class LogEntity extends CommonEntity {
  @Column()
  @ApiProperty({ description: 'log message content' })
  content: string;

  @ManyToOne(() => AdminEntity, (admin) => admin.logs)
  @JoinColumn()
  @ApiProperty({ description: 'user who commited the action' })
  admin: AdminEntity;
}
