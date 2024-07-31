import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { concat, isEmpty, isNil, uniq } from 'lodash';

import { In, IsNull, Like, Not, Repository } from 'typeorm';

import { BusinessException } from '~/common/exceptions/biz.exception';
import { RedisKeys } from '~/constants/cache.constant';
import { ErrorEnum } from '~/constants/error-code.constant';
import { genAuthPermKey, genAuthTokenKey } from '~/helper/genRedisKey';
// import { SseService } from '~/modules/sse/sse.service';
import { MenuEntity } from './entity/menu.entity';

import { deleteEmptyChildren, generatorMenu, generatorRouters } from '~/utils';

import { RoleService } from '../role/role.service';

import { MenuDto, MenuQueryDto, MenuUpdateDto } from './dto/menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectRedis() private redis: Redis,
    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
    private roleService: RoleService,
    // private sseService: SseService,
  ) {}

  /**
   * Get all menus and permissions
   */
  async list({ name, path, permission }: MenuQueryDto): Promise<MenuEntity[]> {
    const menus = await this.menuRepository.find({
      where: {
        ...(name && { name: Like(`%${name}%`) }),
        ...(path && { path: Like(`%${path}%`) }),
        ...(permission && { permission: Like(`%${permission}%`) }),
      },
    });
    const menuList = generatorMenu(menus);

    if (!isEmpty(menuList)) {
      deleteEmptyChildren(menuList);
      return menuList;
    }
    // If the generated tree structure is empty, return the original menu list
    return menus;
  }

  async create(menu: MenuDto): Promise<void> {
    const result = await this.menuRepository.save(menu);
    console.log(result);
    // this.sseService.noticeClientToUpdateMenusByMenuIds([result.id]);
  }

  async update(id: number, menu: MenuUpdateDto): Promise<void> {
    await this.menuRepository.update(id, menu);
    // this.sseService.noticeClientToUpdateMenusByMenuIds([id]);
  }

  /**
   * Get all menus based on roles
   */
  async getMenus(uid: number) {
    const roleIds = await this.roleService.getRoleIdsByUser(uid);
    let menus: MenuEntity[] = [];

    if (isEmpty(roleIds)) return generatorRouters([]);

    if (this.roleService.hasAdminRole(roleIds)) {
      menus = await this.menuRepository.find();
    } else {
      menus = await this.menuRepository
        .createQueryBuilder('menu')
        .innerJoinAndSelect('menu.roles', 'role')
        .andWhere('role.id IN (:...roleIds)', { roleIds })
        .orderBy('menu.order_no', 'ASC')
        .getMany();
    }

    const menuList = generatorRouters(menus);
    return menuList;
  }

  /**
   * Check if menu creation rules are met
   */
  async check(dto: Partial<MenuDto>): Promise<void | never> {
    if (dto.type === 2 && !dto.parentId) {
      // Cannot create permissions directly; must have a parent
      throw new BusinessException(ErrorEnum.PERMISSION_REQUIRES_PARENT);
    }
    if (dto.type === 1 && dto.parentId) {
      const parent = await this.getMenuItemInfo(dto.parentId);
      if (isEmpty(parent))
        throw new BusinessException(ErrorEnum.PARENT_MENU_NOT_FOUND);

      if (parent && parent.type === 1) {
        // Illegal operation if the parent is also a menu
        throw new BusinessException(
          ErrorEnum.ILLEGAL_OPERATION_DIRECTORY_PARENT,
        );
      }
    }
  }

  /**
   * Find child menus under the current menu, including directories and menus
   */
  async findChildMenus(mid: number): Promise<any> {
    const allMenus: any = [];
    const menus = await this.menuRepository.findBy({ parentId: mid });
    // if (_.isEmpty(menus)) {
    //   return allMenus;
    // }
    // const childMenus: any = [];
    for (const menu of menus) {
      if (menu.type !== 2) {
        // If the child is a menu or directory, continue to find lower-level menus
        const c = await this.findChildMenus(menu.id);
        allMenus.push(c);
      }
      allMenus.push(menu.id);
    }
    return allMenus;
  }

  /**
   * Get information about a specific menu
   * @param mid menu id
   */
  async getMenuItemInfo(mid: number): Promise<MenuEntity> {
    const menu = await this.menuRepository.findOneBy({ id: mid });
    return menu;
  }

  /**
   * Get information about a specific menu and associated parent menu
   */
  async getMenuItemAndParentInfo(mid: number) {
    const menu = await this.menuRepository.findOneBy({ id: mid });
    let parentMenu: MenuEntity | undefined;
    if (menu && menu.parentId)
      parentMenu = await this.menuRepository.findOneBy({ id: menu.parentId });

    return { menu, parentMenu };
  }

  /**
   * Check if a node route exists
   */
  async findRouterExist(path: string): Promise<boolean> {
    const menus = await this.menuRepository.findOneBy({ path });
    return !isEmpty(menus);
  }

  /**
   * Get all permissions for the current user
   */
  async getPermissions(uid: number): Promise<string[]> {
    const roleIds = await this.roleService.getRoleIdsByUser(uid);
    let permission: any[] = [];
    let result: any = null;
    if (this.roleService.hasAdminRole(roleIds)) {
      result = await this.menuRepository.findBy({
        permission: Not(IsNull()),
        type: In([1, 2]),
      });
    } else {
      if (isEmpty(roleIds)) return permission;

      result = await this.menuRepository
        .createQueryBuilder('menu')
        .innerJoinAndSelect('menu.roles', 'role')
        .andWhere('role.id IN (:...roleIds)', { roleIds })
        .andWhere('menu.type IN (1,2)')
        .andWhere('menu.permission IS NOT NULL')
        .getMany();
    }
    if (!isEmpty(result)) {
      result.forEach((e) => {
        if (e.permission)
          permission = concat(permission, e.permission.split(','));
      });
      permission = uniq(permission);
    }
    return permission;
  }

  /**
   * Delete multiple menus
   */
  async deleteMenuItem(mids: number[]): Promise<void> {
    await this.menuRepository.delete(mids);
  }

  /**
   * Refresh permissions for a specified user ID
   */
  async refreshPerms(uid: number): Promise<void> {
    const perms = await this.getPermissions(uid);
    const online = await this.redis.get(genAuthTokenKey(uid));
    if (online) {
      // Check if online
      await this.redis.set(genAuthPermKey(uid), JSON.stringify(perms));
      console.log('refreshPerms');

      // this.sseService.noticeClientToUpdateMenusByUserIds([uid]);
    }
  }

  /**
   * Refresh permissions for all online users
   */
  async refreshOnlineUserPerms(isNoticeUser = true): Promise<void> {
    const onlineUserIds: string[] = await this.redis.keys(genAuthTokenKey('*'));
    if (onlineUserIds && onlineUserIds.length > 0) {
      const promiseArr = onlineUserIds
        .map((i) => Number.parseInt(i.split(RedisKeys.AUTH_TOKEN_PREFIX)[1]))
        .filter((i) => i)
        .map(async (uid) => {
          const perms = await this.getPermissions(uid);
          await this.redis.set(genAuthPermKey(uid), JSON.stringify(perms));
          return uid;
        });
      const uids = await Promise.all(promiseArr);
      console.log('refreshOnlineUserPerms');
      // if (isNoticeUser)
      // this.sseService.noticeClientToUpdateMenusByUserIds(uids);
    }
  }

  /**
   * Check if there are associated roles based on menu ID
   */
  async checkRoleByMenuId(id: number): Promise<boolean> {
    return !!(await this.menuRepository.findOne({
      where: {
        roles: {
          id,
        },
      },
    }));
  }
}
