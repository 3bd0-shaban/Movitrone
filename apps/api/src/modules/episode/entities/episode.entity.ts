import { videoShared } from '@common/utilities';
import { Admin } from 'src/modules/admin/entities/admin.entity';
import { Genre } from 'src/modules/genre/entities/genre.entity';

import { Column, Entity, JoinTable, ManyToMany, OneToOne } from 'typeorm';

@Entity()
export class Episode extends videoShared {
  @Column()
  movie_Title: string;

  @ManyToMany((type) => Genre, (genre) => genre.movies)
  @JoinTable()
  genres: Genre[];

  @OneToOne((type) => Admin, (genre) => genre.episodes, { nullable: true })
  @JoinTable()
  created_By: Admin | null;
}
