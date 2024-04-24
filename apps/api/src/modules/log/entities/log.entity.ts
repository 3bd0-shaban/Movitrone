import { Admin } from 'src/modules/admin/entities/admin.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  content: string;

  @ManyToOne((type) => Admin, (admin) => admin.logs)
  admin: Admin;

  @Column({ default: Date.now() })
  created_At: string;
}
