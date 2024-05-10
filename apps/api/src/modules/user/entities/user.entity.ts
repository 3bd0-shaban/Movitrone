import { UserShared } from '~/shared/entities/user.entity';
import { Entity } from 'typeorm';

@Entity({ name: 'website_users' })
export class UserEntity extends UserShared {}
