import { Episode } from '~/modules/episode/entities/episode.entity';
import { LogEntity } from '~/modules/log/entities/log.entity';
import { UserShared } from '~/shared/entities/user.entity';
import {
  Entity,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  Relation,
} from 'typeorm';
import { RoleEntity } from '~/modules/system/role/entity/role.entity';

@Entity({ name: 'sys_user' })
export class AdminEntity extends UserShared {
  @Column({
    type: 'enum',
    enum: ['Super Admin', 'Admin'],
    default: 'Admin',
  })
  role: string;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({
    name: 'sys_user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Relation<RoleEntity[]>;

  @OneToMany((type) => LogEntity, (log) => log.admin)
  logs: LogEntity[];

  @OneToMany((type) => Episode, (episode) => episode.created_By)
  episodes: Episode[];
}
