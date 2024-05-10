import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { GenreEntity } from 'src/modules/genre/entities/genre.entity';
import { videoShared } from 'src/common/entity/video.entity';

@Entity({ name: 'movies' })
export class MovieEntity extends videoShared {
  @Column()
  movie_Title: string;

  @ManyToMany((type) => GenreEntity, (genre) => genre.movies)
  @JoinTable()
  genres: GenreEntity[];
}
