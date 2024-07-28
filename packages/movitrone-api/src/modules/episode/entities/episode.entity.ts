import { DashboardUserEntity } from '~/modules/users/dashboardUser/entities/admin.entity';
import { GenreEntity } from '~/modules/genre/entities/genre.entity';

import { Column, Entity, JoinTable, ManyToMany, OneToOne } from 'typeorm';
import { videoShared } from '~/common/entity/video.entity';

@Entity({ name: 'episodes' })
export class Episode extends videoShared {
  @Column()
  movie_Title: string;

  @ManyToMany((type) => GenreEntity, (genre) => genre.movies)
  @JoinTable()
  genres: GenreEntity[];

  @OneToOne((type) => DashboardUserEntity, (genre) => genre.episodes, {
    nullable: true,
  })
  @JoinTable()
  created_By: DashboardUserEntity | null;
}
