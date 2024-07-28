import { CommonEntity } from '~/common/entity/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { DashboardUserEntity } from '~/modules/users/dashboardUser/entities/admin.entity';

@Entity({ name: 'logs' })
export class LogEntity extends CommonEntity {
  @Column()
  content: string;

  @ManyToOne(() => DashboardUserEntity, (admin) => admin.logs)
  @JoinColumn()
  admin: DashboardUserEntity;
}
