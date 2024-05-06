import { CommonEntity } from 'src/common/entity/common.entity';
import { AdminEntity } from 'src/modules/admin/entities/admin.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity({ name: 'logs' })
export class LogEntity extends CommonEntity {
  @Column()
  content: string;

  @ManyToOne(() => AdminEntity, (admin) => admin.logs)
  @JoinColumn()
  admin: AdminEntity;
}
