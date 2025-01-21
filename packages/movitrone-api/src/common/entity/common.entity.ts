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
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export abstract class CompleteEntity extends CommonEntity {
  @ApiHideProperty()
  @Exclude()
  @Column({
    name: 'created_by',
    update: false,
    comment: 'Created By',
    nullable: true,
  })
  createBy: number;

  @ApiHideProperty()
  @Exclude()
  @Column({ name: 'updated_by', comment: 'updator', nullable: true })
  updateBy: number;

  @ApiProperty({ description: '创建者' })
  @VirtualColumn({
    query: (alias) => `SELECT email FROM sys_user WHERE id = 1`,
  })
  creator: string;

  @ApiProperty({ description: '更新者' })
  @VirtualColumn({
    query: (alias) =>
      `SELECT email FROM sys_user WHERE id = ${alias}.update_by`,
  })
  updater: string;
}
