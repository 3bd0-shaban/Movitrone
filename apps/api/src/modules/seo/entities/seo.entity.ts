import { AdminEntity } from '~/modules/admin/entities/admin.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from '~/common/entity/common.entity';

@Entity({ name: 'seos' })
export class SeoEntity extends CommonEntity {
  @Column()
  tag_Title: string;

  @Column()
  tag_Description: string;

  @Column()
  country: string;

  @Column()
  page: string;

  @OneToOne((type) => AdminEntity, (admin) => admin.id)
  created_By?: AdminEntity;

  @Column()
  canonical_Url: string;

  @Column('simple-array')
  keywoprds: string[];

  @Column({
    type: 'enum',
    enum: ['Optimized', 'Not Optimized'],
  })
  Seo_Status: string;

  @Column('boolean', { default: true })
  is_Active?: boolean;

  @Column('boolean', { default: false })
  is_Main?: boolean;
}
