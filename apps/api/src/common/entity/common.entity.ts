import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VirtualColumn,
} from 'typeorm';

export abstract class CommonEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export abstract class CompleteEntity extends CommonEntity {
  @ApiHideProperty()
  @Exclude()
  @Column({ name: 'created_by', update: false, comment: '创建者' })
  created_By: number;

  @ApiHideProperty()
  @Exclude()
  @Column({ name: 'updated_by', comment: '更新者' })
  updated_By: number;

  @ApiProperty({ description: '创建者' })
  @VirtualColumn({
    query: (alias) =>
      `SELECT username FROM sys_user WHERE id = ${alias}.create_by`,
  })
  creator: string;

  @ApiProperty({ description: '更新者' })
  @VirtualColumn({
    query: (alias) =>
      `SELECT username FROM sys_user WHERE id = ${alias}.update_by`,
  })
  updater: string;
}
