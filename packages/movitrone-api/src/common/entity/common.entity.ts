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
    name: 'create_by',
    update: false,
    comment: 'Created By',
    nullable: true,
  })
  createBy: number;

  @ApiHideProperty()
  @Exclude()
  @Column({ name: 'update_by', comment: 'Updated By', nullable: true })
  updateBy: number;

  @ApiProperty({ description: 'Creator' })
  @VirtualColumn({
    query: (alias) =>
      `SELECT firstname FROM sys_user WHERE id = ${alias}.create_by`,
  })
  creator: string;

  @ApiProperty({ description: 'Updator' })
  @VirtualColumn({
    query: (alias) =>
      `SELECT firstname FROM sys_user WHERE id = ${alias}.update_by`,
  })
  updater: string;
}
