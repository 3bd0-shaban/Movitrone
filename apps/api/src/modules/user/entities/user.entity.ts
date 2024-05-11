import { UserShared } from '~/shared/entities/user.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'website_users' })
export class UserEntity extends UserShared {
  @Column()
  otp: string;

  @Column('boolean')
  is_Verified: boolean;
}
