import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { videoShared } from '@common/utilities';
import { Genre } from 'src/modules/genre/entities/genre.entity';

@Entity()
export class Movie extends videoShared {
  @Column()
  movie_Title: string;

  @ManyToMany((type) => Genre, (genre) => genre.movies)
  @JoinTable()
  genres: Genre[];
}
