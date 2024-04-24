import { UserShared } from '@common/utilities';
import { Entity } from 'typeorm';

@Entity()
export class User extends UserShared {}
