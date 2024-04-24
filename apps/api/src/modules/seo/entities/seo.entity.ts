import { Admin } from 'src/modules/admin/entities/admin.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
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

  @OneToOne((type) => Admin, (admin) => admin.u_id)
  created_By: Admin;

  @Column()
  canonical_Url: number;

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
