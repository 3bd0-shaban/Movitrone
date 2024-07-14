import { iAdmin } from './iAdmin';

export interface iUser {
  id?: number;
  email?: string;
  firstname?: string;
  password?: string;
  lastname?: string;
  photo?: string;
  location?: string;
  ip?: string;
  created_By?: iAdmin;
  country?: string;
  passwordConfirm?: string;
  is_Verified?: boolean;
  is_Active?: boolean;
  is_Blocked?: boolean;
  otp?: number;
  mapLocation?: number;
  timeZone?: number;
  phone?: string;
  lastLogin?: string;
  updatedAt?: Date;
  facebookId?: string;
  linkdinId?: string;
  Provider?: string;
  createdAt?: Date;
}
