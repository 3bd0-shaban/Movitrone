import { ForbiddenException } from '@nestjs/common';

import { envBoolean } from '~/global/env';
import { isExternal } from '~/utils/is.util';

import { uniqueSlash } from './tool.util';
import { MenuEntity } from '~/modules/system/menu/entity/menu.entity';

export interface RouteRecordRaw {
  id: number;
  path: string;
  name: string;
  component?: string;
  redirect?: string;
  meta: {
    title: string;
    type: number;
  };
  children?: RouteRecordRaw[];
}

function createRoute(menu: MenuEntity, _isRoot): RouteRecordRaw {
  const commonMeta: RouteRecordRaw['meta'] = {
    title: menu.name,
    type: menu.type,
  };

  if (isExternal(menu.path)) {
    return {
      id: menu.id,
      path: menu.path,
      // component: 'IFrame',
      name: menu.name,
      meta: { ...commonMeta },
    };
  }

  // Directory
  if (menu.type === 0) {
    return {
      id: menu.id,
      path: menu.path,
      name: menu.name,
      meta: { ...commonMeta },
    };
  }

  return {
    id: menu.id,
    path: menu.path,
    name: menu.name,
    meta: {
      ...commonMeta,
    },
  };
}

function filterAsyncRoutes(
  menus: MenuEntity[],
  parentRoute: MenuEntity,
): RouteRecordRaw[] {
  const res: RouteRecordRaw[] = [];

  menus.forEach((menu) => {
    if (menu.type === 2) {
      // If it's a permission or disabled, skip directly
      return;
    }
    // Render root-level menu
    let realRoute: RouteRecordRaw;

    const genFullPath = (path: string, parentPath) => {
      return uniqueSlash(
        path.startsWith('/') ? path : `/${parentPath}/${path}`,
      );
    };

    if (!parentRoute && !menu.parentId && menu.type === 1) {
      // Root menu
      realRoute = createRoute(menu, true);
    } else if (!parentRoute && !menu.parentId && menu.type === 0) {
      // Directory
      const childRoutes = filterAsyncRoutes(menus, menu);
      realRoute = createRoute(menu, true);
      if (childRoutes && childRoutes.length > 0) {
        realRoute.redirect = genFullPath(childRoutes[0].path, realRoute.path);
        realRoute.children = childRoutes;
      }
    } else if (
      parentRoute &&
      parentRoute.id === menu.parentId &&
      menu.type === 1
    ) {
      // Submenu
      realRoute = createRoute(menu, false);
    } else if (
      parentRoute &&
      parentRoute.id === menu.parentId &&
      menu.type === 0
    ) {
      // If it's still a directory, continue recursion
      const childRoutes = filterAsyncRoutes(menus, menu);
      realRoute = createRoute(menu, false);
      if (childRoutes && childRoutes.length > 0) {
        realRoute.redirect = genFullPath(childRoutes[0].path, realRoute.path);
        realRoute.children = childRoutes;
      }
    }
    // Add current route
    if (realRoute) res.push(realRoute);
  });
  return res;
}

export function generatorRouters(menus: MenuEntity[]) {
  return filterAsyncRoutes(menus, null);
}

// Get all menus and permissions
function filterMenuToTable(menus: MenuEntity[], parentMenu) {
  const res = [];
  menus.forEach((menu) => {
    // Render root-level menu
    let realMenu;
    if (!parentMenu && !menu.parentId && menu.type === 1) {
      // Root menu, find submenus under this root menu, as it may contain permissions
      const childMenu = filterMenuToTable(menus, menu);
      realMenu = { ...menu };
      realMenu.children = childMenu;
    } else if (!parentMenu && !menu.parentId && menu.type === 0) {
      // Root directory
      const childMenu = filterMenuToTable(menus, menu);
      realMenu = { ...menu };
      realMenu.children = childMenu;
    } else if (
      parentMenu &&
      parentMenu.id === menu.parentId &&
      menu.type === 1
    ) {
      // Find submenus under child menu
      const childMenu = filterMenuToTable(menus, menu);
      realMenu = { ...menu };
      realMenu.children = childMenu;
    } else if (
      parentMenu &&
      parentMenu.id === menu.parentId &&
      menu.type === 0
    ) {
      // If it's still a directory, continue recursion
      const childMenu = filterMenuToTable(menus, menu);
      realMenu = { ...menu };
      realMenu.children = childMenu;
    } else if (
      parentMenu &&
      parentMenu.id === menu.parentId &&
      menu.type === 2
    ) {
      realMenu = { ...menu };
    }
    // Add current route
    if (realMenu) {
      realMenu.pid = menu.id;
      res.push(realMenu);
    }
  });
  return res;
}

export function generatorMenu(menu: MenuEntity[]) {
  return filterMenuToTable(menu, null);
}

/** Check if it's a demo environment. If it is, deny the operation */
export function checkIsDemoMode() {
  if (envBoolean('IS_DEMO'))
    throw new ForbiddenException('Operation not allowed in demo mode');
}
