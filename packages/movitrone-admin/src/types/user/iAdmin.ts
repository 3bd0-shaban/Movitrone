export interface iAdmin {
  id?: number;
  email?: string;
  firstname?: string;
  password?: string;
  lastname?: string;
  photo?: string;
  phone?: string;
  updatedAt?: Date;
  createdAt?: Date;
  country?: string;
  role?: iRoleEnum;
}

export type iRoleEnum = 'Admin' | 'Super Admin';
