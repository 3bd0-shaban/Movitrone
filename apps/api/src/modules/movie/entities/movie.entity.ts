import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { Genre } from 'src/modules/genre/entities/genre.entity';
import { videoShared } from 'src/common/entity/video.entity';

@Entity({ name: 'movies' })
export class Movie extends videoShared {
  @Column()
  movie_Title: string;

  @ManyToMany((type) => Genre, (genre) => genre.movies)
  @JoinTable()
  genres: Genre[];
}
