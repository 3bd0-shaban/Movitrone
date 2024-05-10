import { videoShared } from '@common/utilities';
import { AdminEntity } from '~/modules/admin/entities/admin.entity';
import { GenreEntity } from '~/modules/genre/entities/genre.entity';

import { Column, Entity, JoinTable, ManyToMany, OneToOne } from 'typeorm';

@Entity({ name: 'episodes' })
export class Episode extends videoShared {
  @Column()
  movie_Title: string;

  @ManyToMany((type) => GenreEntity, (genre) => genre.movies)
  @JoinTable()
  genres: GenreEntity[];

  @OneToOne((type) => AdminEntity, (genre) => genre.episodes, {
    nullable: true,
  })
  @JoinTable()
  created_By: AdminEntity | null;
}
