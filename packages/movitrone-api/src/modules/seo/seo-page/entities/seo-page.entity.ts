import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CommonEntity } from '~/common/entity/common.entity';
import { SeoCountryEntity } from '~/modules/seo/seo-country/entities/seo-country.entity';
import { UserEntity } from '~/modules/users/websiteUser/entities/user.entity';
import { SEO_PAGES_ENUM, SEO_STATUS_ENUM } from '../seo-page.constant';

@Entity({ name: 'seo_pages' })
export class SeoPageEntity extends CommonEntity {
  @Column()
  tag_Title: string;

  @Column()
  tag_Description: string;

  @ManyToOne((type) => SeoCountryEntity, (country) => country.page)
  country: SeoCountryEntity;

  @Column({ type: 'enum', enum: SEO_PAGES_ENUM })
  page: SEO_PAGES_ENUM;

  @OneToOne((type) => UserEntity, (admin) => admin.id)
  created_By?: UserEntity;

  @Column()
  canonical_Url: string;

  @Column('simple-array')
  keywoprds: string[];

  @Column({
    type: 'enum',
    enum: SEO_STATUS_ENUM,
  })
  Seo_Status: SEO_STATUS_ENUM;
}
