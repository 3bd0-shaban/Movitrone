import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class UserShared {
  @PrimaryGeneratedColumn()
  u_id: number;

  @Column()
  u_firstname: string;

  @Column()
  u_lastname: number;

  @Column()
  u_phone: string;

  @Column()
  u_email: string;

  @Column()
  u_password: string;

  @Column({ default: Date.now() })
  created_At: string;
}
