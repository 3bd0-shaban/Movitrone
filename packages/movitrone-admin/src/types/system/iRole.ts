import { iCommonTypes } from '../iCommonTypes';
import { iMenu } from './iMenu';

export interface iRole extends iCommonTypes {
  name: string;
  value: string;
  status: 0 | 1;
  menuIds: number[];
}
