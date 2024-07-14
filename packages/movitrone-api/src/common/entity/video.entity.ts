import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from './common.entity';

export class videoShared extends CommonEntity {
  @Column()
  description: string;

  @Column()
  imdb_Id: string;

  @Column('int')
  imdb_Rate: number;

  @Column('int')
  imdb_vots: number;

  @Column()
  country: string;

  @Column('int')
  duration: number;

  @Column()
  release: string;

  @Column('int', { default: 0 })
  likes?: string;

  @Column('int', { default: 0 })
  dislikes?: string;

  @Column({ nullable: true })
  director?: string;

  @Column()
  poster_Url: string;

  @Column()
  trailer_Url: string;

  @Column('boolean', { default: true })
  is_Active?: string;

  @Column('boolean', { default: true })
  is_Commenting?: string;

  @Column()
  language: string;

  @Column('simple-array')
  servers_url: string[];
}
