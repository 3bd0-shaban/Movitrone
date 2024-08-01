import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import { MenuEntity } from '~/modules/system/menu/entity/menu.entity';

export class MenuMeta extends PartialType(
  OmitType(MenuEntity, [
    'parentId',
    'createdAt',
    'updatedAt',
    'id',
    'roles',
    'path',
    'name',
  ] as const),
) {
  title: string;
}
export class AccountMenus extends PickType(MenuEntity, [
  'id',
  'path',
  'name',
] as const) {
  meta: MenuMeta;
}
