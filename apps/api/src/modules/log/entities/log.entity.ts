import { CommonEntity } from 'src/common/entity/common.entity';
import { AdminEntity } from 'src/modules/admin/entities/admin.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class LogEntity extends CommonEntity {
  @Column()
  content: string;

  @OneToOne(() => AdminEntity)
  @JoinColumn()
  admin: AdminEntity;
}
