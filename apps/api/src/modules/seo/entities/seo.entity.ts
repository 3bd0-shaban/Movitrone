import { AdminEntity } from '~/modules/admin/entities/admin.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'seos' })
export class Seo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tag_Title: number;

  @Column()
  tag_Description: number;

  @Column()
  country: string;

  @Column()
  page: string;

  @OneToOne((type) => AdminEntity, (admin) => admin.id)
  created_By: AdminEntity;

  @Column()
  canonical_Url: number;

  @Column('simple-array')
  keywoprds: string[];

  @Column({
    type: 'enum',
    enum: ['Optimized', 'Not Optimized'],
  })
  Seo_Status: string;

  @Column('boolean')
  is_Active: boolean;

  @Column('boolean')
  is_Main: boolean;

  @Column({ default: Date.now() })
  created_At: string;
}
