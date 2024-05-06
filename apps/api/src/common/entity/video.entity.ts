import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from './common.entity';

export class videoShared extends CommonEntity {
  @Column()
  description: string;

  @Column()
  imdb_Id: number;

  @Column()
  imdb_Rate: string;

  @Column()
  imdb_vots: string;

  @Column()
  country: string;

  @Column()
  duration: string;

  @Column()
  release: string;

  @Column()
  likes: string;

  @Column()
  dislikes: string;

  @Column()
  director: string;

  @Column()
  poster_Url: string;

  @Column()
  trailer_Url: string;

  @Column()
  is_Active: string;

  @Column()
  is_Commenting: string;

  @Column()
  language: string;
}
