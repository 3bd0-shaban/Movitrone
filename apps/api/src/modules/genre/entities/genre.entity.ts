import { CommonEntity } from 'src/common/entity/common.entity';
import { Movie } from 'src/modules/movie/entities/movie.entity';
import { Entity, Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'genres' })
export class Genre extends CommonEntity {
  @Column()
  genre: string;

  @ManyToMany((type) => Movie, (movie) => movie.genres)
  movies: Movie[];
}
