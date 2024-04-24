import { Movie } from 'src/modules/movie/entities/movie.entity';
import { Entity, Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  genre: string;

  @ManyToMany((type) => Movie, (movie) => movie.genres)
  movies: Movie[];

  @Column({ default: Date.now() })
  created_At: string;
}
