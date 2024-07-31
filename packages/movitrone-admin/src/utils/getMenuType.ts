export const getMenuType = (type: number) => {
  if (type === 0) {
    return { name: 'Table Of Contant', color: 'yellow' };
  } else if (type === 1) {
    return { name: 'Menu', color: 'green' };
  } else if (type === 2) {
    return { name: 'Permission', color: 'red' };
  }
};
