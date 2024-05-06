import { videoShared } from '@common/utilities';
import { AdminEntity } from 'src/modules/admin/entities/admin.entity';
import { Genre } from 'src/modules/genre/entities/genre.entity';

import { Column, Entity, JoinTable, ManyToMany, OneToOne } from 'typeorm';

@Entity({ name: 'episodes' })
export class Episode extends videoShared {
  @Column()
  movie_Title: string;

  @ManyToMany((type) => Genre, (genre) => genre.movies)
  @JoinTable()
  genres: Genre[];

  @OneToOne((type) => AdminEntity, (genre) => genre.episodes, {
    nullable: true,
  })
  @JoinTable()
  created_By: AdminEntity | null;
}
