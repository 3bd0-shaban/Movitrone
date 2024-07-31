import { Column, Entity, ManyToMany, Relation } from 'typeorm';

import { CompleteEntity } from '~/common/entity/common.entity';
import { RoleEntity } from '../../role/entity/role.entity';

@Entity({ name: 'sys_menu' })
export class MenuEntity extends CompleteEntity {
  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  path: string;

  @Column({ nullable: true })
  permission: string;

  @Column({ type: 'tinyint', default: 0 })
  type: number;

  @Column({ name: 'order_no', type: 'int', nullable: true, default: 0 })
  orderNo: number;

  @ManyToMany(() => RoleEntity, (role) => role.menus, {
    onDelete: 'CASCADE',
  })
  roles: Relation<RoleEntity[]>;
}
