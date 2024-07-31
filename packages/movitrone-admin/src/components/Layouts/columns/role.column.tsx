import moment from 'moment';
import { getMenuType } from '@/utils/getMenuType';
import { type TableColumnsType, Tag } from 'antd';
import { iRole } from '@/types/system/iRole';

const RoleMenu: TableColumnsType<iRole> = [
  {
    title: 'Role Name',
    render: (_, record) => <p>{record.name}</p>,
  },
  {
    title: 'Role Value',
    render: (_, record) => <Tag color="green">{record.value}</Tag>,
  },
  {
    title: 'Created On',
    render: (_, record) => <p>{moment(record.createdAt).calendar()}</p>,
  },
];
export default RoleMenu;
