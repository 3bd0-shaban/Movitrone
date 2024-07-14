import type { TabsProps } from 'antd';

export const getActiveMenu = (items: TabsProps['items'], pathname: string) => {
  const activeItem = items?.find((item) =>
    pathname?.includes(item.tabKey as string),
  );
  return activeItem?.key;
};
