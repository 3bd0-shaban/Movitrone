import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, Relation } from 'typeorm';

import { CompleteEntity } from '~/common/entity/common.entity';

import { MenuEntity } from '../../menu/entity/menu.entity';
import { AdminEntity } from '~/modules/users/admin/entities/admin.entity';

@Entity({ name: 'sys_role' })
export class RoleEntity extends CompleteEntity {
  @Column({ length: 50, unique: true })
  @ApiProperty({ description: 'Role Name' })
  name: string;

  @Column({ unique: true, comment: 'Role Identifier' })
  @ApiProperty({ description: 'Role Identifier' })
  value: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Role Description' })
  remark: string;

  @Column({ type: 'tinyint', nullable: true, default: 1 })
  @ApiProperty({ description: 'Status: 1 Enabled, 0 Disabled' })
  status: number;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Default User' })
  default: boolean;

  @ApiHideProperty()
  @ManyToMany(() => AdminEntity, (user) => user.roles)
  users: Relation<AdminEntity[]>;

  @ApiHideProperty()
  @ManyToMany(() => MenuEntity, (menu) => menu.roles, {})
  @JoinTable({
    name: 'sys_role_menus',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' },
  })
  menus: Relation<MenuEntity[]>;
}
