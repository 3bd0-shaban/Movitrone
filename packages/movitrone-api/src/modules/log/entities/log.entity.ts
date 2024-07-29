import { CommonEntity } from '~/common/entity/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { AdminEntity } from '~/modules/users/admin/entities/admin.entity';

@Entity({ name: 'logs' })
export class LogEntity extends CommonEntity {
  @Column()
  content: string;

  @ManyToOne(() => AdminEntity, (admin) => admin.logs)
  @JoinColumn()
  admin: AdminEntity;
}
