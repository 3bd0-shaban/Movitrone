import { CommonEntity } from 'src/common/entity/common.entity';
import { MovieEntity } from 'src/modules/movie/entities/movie.entity';
import { Entity, Column, ManyToMany } from 'typeorm';

@Entity({ name: 'genres' })
export class GenreEntity extends CommonEntity {
  @Column()
  genre: string;

  @ManyToMany((type) => MovieEntity, (movie) => movie)
  movies: MovieEntity[];
}
