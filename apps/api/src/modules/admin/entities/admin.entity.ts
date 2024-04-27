import { Episode } from 'src/modules/episode/entities/episode.entity';
import { Log } from 'src/modules/log/entities/log.entity';
import { UserShared } from 'src/shared/entities/user.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class Admin extends UserShared {
  @Column({
    type: 'enum',
    enum: ['Super Admin', 'Admin'],
    default: 'Admin',
  })
  role: string;

  @OneToMany((type) => Log, (log) => log.admin)
  logs: Log[];

  @OneToMany((type) => Episode, (episode) => episode.created_By)
  episodes: Episode[];
}
