import { iAdmin } from '../user/iAdmin';
export interface iMenu {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: iAdmin;
  updatedBy: iAdmin | null;
  parentId: number;
  name: string;
  path: string;
  permission: string;
  type: iMenuTypesEnum;
  icon: string;
  orderNo: string;
  component: string;
  isExt: boolean;
  extOpenMode: number;
  keepAlive: number;
  show: number;
  activeMenu: string;
  status: number;
}

export enum iMenuTypesEnum {
  TABLEOFCONTENT = 0,
  MENU = 1,
  PERMISSION = 2,
}
