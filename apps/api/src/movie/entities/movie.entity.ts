import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  year: number;

  @Column()
  rated: string;

  // @Column()
  // released: Date;

  // @Column()
  // runtime: number;

  // @Column()
  // genre: string;

  // @Column()
  // director: string;

  // @Column()
  // writer: string;

  // @Column()
  // actors: string;

  // @Column()
  // plot: string;

  // @Column()
  // language: string;

  // @Column()
  // country: string;

  // @Column()
  // awards: string;

  // @Column()
  // poster: string;

  // @Column({ type: 'json', nullable: true })
  // ratings: { source: string; value: string }[];

  // @Column()
  // metascore: number;

  // @Column()
  // imdbRating: number;

  // @Column()
  // imdbVotes: number;

  // @Column()
  // imdbID: string;

  // @Column()
  // type: string;
}
