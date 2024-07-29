import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { SeoPageEntity } from '~/modules/seo/seo-page/entities/seo-page.entity';
import { AdminEntity } from '~/modules/users/admin/entities/admin.entity';

@Entity({ name: 'seo_countries' })
export class SeoCountryEntity {
  @PrimaryColumn({ unique: true, length: 2 })
  country: string;

  @OneToMany((type) => SeoPageEntity, (page) => page.country)
  page: SeoPageEntity[];

  @OneToOne((type) => AdminEntity, (admin) => admin.id)
  created_By?: AdminEntity;

  @Column('boolean', { default: true })
  is_Active?: boolean;

  @Column('boolean', { default: false })
  is_Main?: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
