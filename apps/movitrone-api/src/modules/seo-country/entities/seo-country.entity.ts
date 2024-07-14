import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { SeoPageEntity } from '~/modules/seo-page/entities/seo-page.entity';
import { UserEntity } from '~/modules/user/entities/user.entity';

@Entity({ name: 'seo_countries' })
export class SeoCountryEntity {
  @PrimaryColumn({ unique: true, length: 2 })
  country: string;

  @OneToMany((type) => SeoPageEntity, (page) => page.country)
  page: SeoPageEntity[];

  @OneToOne((type) => UserEntity, (admin) => admin.id)
  created_By?: UserEntity;

  @Column('boolean', { default: true })
  is_Active?: boolean;

  @Column('boolean', { default: false })
  is_Main?: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
