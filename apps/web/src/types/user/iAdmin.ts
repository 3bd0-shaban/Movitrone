export interface iAdmin {
  id?: string;
  email?: string;
  firstname?: string;
  password?: string;
  lastname?: string;
  photo?: string;
  phone?: string;
  updatedAt?: Date;
  createdAt?: Date;
  role?: string;
}

export interface AuthState {
  access_token: string;
  status: number;
  message: string;
  user: iAdmin;
}
