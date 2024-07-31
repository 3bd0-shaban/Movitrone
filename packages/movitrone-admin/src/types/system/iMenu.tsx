import { iAdmin } from '../user/iAdmin';
export interface iMenu {
  id: number;
  key: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: iAdmin;
  updatedBy: iAdmin | null;
  parentId: number;
  name: string;
  path: string;
  permission: string;
  type: iMenuTypesEnum;
  children: iMenu[];
}

export enum iMenuTypesEnum {
  TABLEOFCONTENT = 0,
  MENU = 1,
  PERMISSION = 2,
}
