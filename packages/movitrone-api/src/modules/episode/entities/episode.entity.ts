import { GenreEntity } from '~/modules/genre/entities/genre.entity';

import { Column, Entity, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { videoShared } from '~/common/entity/video.entity';
import { AdminEntity } from '~/modules/users/admin/entities/admin.entity';

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
