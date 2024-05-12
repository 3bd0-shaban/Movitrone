import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'analytics_seo' })
export class SeoAnalyticsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'created_at' })
  timestamp: Date;

  @Column()
  country: string;

  @Column()
  page_Seo: string;

  @Column()
  views_Counts: number;
}
