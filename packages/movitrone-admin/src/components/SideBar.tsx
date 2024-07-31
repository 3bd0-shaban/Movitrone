'use client';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { usePathname } from 'next/navigation';
import React, { FC } from 'react';
import { RiDashboard2Fill } from 'react-icons/ri';
import { PiShieldLight } from 'react-icons/pi';
import { FaStarHalf, FaUserAltSlash, FaUserSecret } from 'react-icons/fa';
import Link from 'next/link';

interface SideBarElementsProps {
  session: {
    role: 'Admin' | 'Super Admin';
  };
}
type MenuItem = Required<MenuProps>['items'][number];

const SideBar: FC<SideBarElementsProps> = ({ session }) => {
  const pathname = usePathname() as string;

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group' | 'divider' | 'item' | 'submenu',
  ): MenuItem {
    //@ts-ignore
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }

  const items: MenuItem[] = [];

  items.push(getItem('Dashboard', 'grp-1', null, [], 'group'));
  items.push(
    getItem(
      <Link href="/">Dashboard</Link>,
      '1',
      <RiDashboard2Fill size={18} />,
    ),
  );
  items.push(
    getItem('Users', '3', <FaUserSecret size={18} />, [
      session?.role !== 'Admin'
        ? getItem(
            <Link href="/users/super-admins">Super Admins</Link>,
            '3-1',
            <PiShieldLight size={18} />,
          )
        : null,
      getItem(
        <Link href="/users/dashboard">Admins</Link>,
        '3-2',
        <FaStarHalf size={18} />,
      ),
      getItem(
        <Link href="/users/website">Website users</Link>,
        '3-6',
        <FaUserAltSlash size={18} />,
      ),
    ]),
  );
  items.push(
    getItem('System', '4', <FaUserSecret size={18} />, [
      getItem(
        <Link href="/system/roles">Roles</Link>,
        '4-2',
        <FaStarHalf size={18} />,
      ),
      getItem(
        <Link href="/system/menu">Permissions</Link>,
        '4-6',
        <FaUserAltSlash size={18} />,
      ),
    ]),
  );
  items.push(
    getItem(
      <Link href="/seo/country">Seo Countries</Link>,
      '4-2',
      <FaStarHalf size={18} />,
      undefined,
      undefined,
    ),
  );
  const selectedTab = items.find(
    (item: any) => item?.label?.props?.href === pathname,
  );
  const insideTab = items.find((item: any) => {
    return item?.children?.find((ch: any) => {
      return ch?.label?.props?.href === pathname;
    });
  });
  return (
    <Menu
      defaultSelectedKeys={[
        selectedTab?.key as string,
        insideTab?.key as string,
      ]}
      mode="inline"
      style={{ minHeight: '100vh' }}
      triggerSubMenuAction={'click'}
      items={items}
    />
  );
};

export default SideBar;
