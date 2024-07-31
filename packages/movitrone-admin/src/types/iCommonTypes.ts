import { iAdmin } from './user/iAdmin';

export interface iCommonTypes {
  createdBy: iAdmin;
  updatedBy: iAdmin;
  createdAt: Date;
  updatedAt: Date;
  creator: string;
  updator: string;
  id: number;
}
