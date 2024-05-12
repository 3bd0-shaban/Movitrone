import { iAdmin } from './iAdmin';

export interface iCompnay {
  c_Name?: string;
  c_Email?: string;
  c_Country?: string;
  c_City?: string;
  c_streetAddress?: string;
  c_postCode?: string;
  c_webiste?: string;
  c_about?: string;
  c_VAT?: string;
  c_commercialRegister?: string;
  c_taxCard?: string;
}
export interface iClient {
  _id?: string;
  key?: string;
  email?: string;
  firstname?: string;
  password?: string;
  lastname?: string;
  company?: iCompnay;
  photo?: string;
  location?: string;
  ip?: string;
  is_Created_By_Employee?: boolean;
  created_By?: iAdmin;
  openedFrom?: string;
  country?: string;
  office?: string;
  passwordConfirm?: string;
  isVerified?: boolean;
  isActive?: boolean;
  isBlocked?: boolean;
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
