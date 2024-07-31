import { Column, Entity, ManyToMany, Relation } from 'typeorm';

import { CompleteEntity } from '~/common/entity/common.entity';
import { RoleEntity } from '../../role/entity/role.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'sys_menu' })
export class MenuEntity extends CompleteEntity {
  @Column({ name: 'parent_id', nullable: true })
  @ApiProperty({ description: 'Id Of Partent menu' })
  parentId: number;

  @Column()
  @ApiProperty({ description: 'Node Name' })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Path ( front end )' })
  path: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'permission flag ( by premission api from server )',
  })
  permission: string;

  @Column({ type: 'tinyint', default: 0 })
  @ApiProperty({
    description: 'menu type ( table of content, menu, permission)',
  })
  type: number;

  @ManyToMany(() => RoleEntity, (role) => role.menus, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({ description: 'Roles assiened' })
  roles: Relation<RoleEntity[]>;
}
