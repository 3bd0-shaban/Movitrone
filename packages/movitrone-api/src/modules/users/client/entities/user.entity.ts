import { UserShared } from '~/shared/entities/user.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'web_user' })
export class ClientEntity extends UserShared {
  @Column()
  otp: string;

  @Column('boolean')
  is_Verified: boolean;
}
