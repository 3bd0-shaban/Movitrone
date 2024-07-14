import { Episode } from '~/modules/episode/entities/episode.entity';
import { LogEntity } from '~/modules/log/entities/log.entity';
import { UserShared } from '~/shared/entities/user.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity({ name: 'dashboard_users' })
export class AdminEntity extends UserShared {
  @Column({
    type: 'enum',
    enum: ['Super Admin', 'Admin'],
    default: 'Admin',
  })
  role: string;

  @OneToMany((type) => LogEntity, (log) => log.admin)
  logs: LogEntity[];

  @OneToMany((type) => Episode, (episode) => episode.created_By)
  episodes: Episode[];
}
