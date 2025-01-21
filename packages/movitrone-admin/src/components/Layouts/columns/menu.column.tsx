import moment from 'moment';
import { getMenuType } from '@/utils/getMenuType';
import { type TableColumnsType, Tag } from 'antd';
import { iMenu } from '@/types/system/iMenu';

const MenuColumn: TableColumnsType<iMenu> = [
  {
    title: 'Node Name',
    fixed: 'left',
    className: '!bg-[#132471]',
    width: 300,
    render: (_, record) => <p>{record.name}</p>,
  },
  {
    title: 'Type',
    render: (_, record) => (
      <Tag color={getMenuType(record.type)?.color}>
        {getMenuType(record.type)?.name}
      </Tag>
    ),
  },
  {
    title: 'Path',
    render: (_, record) => <p>{record.path}</p>,
  },
  {
    title: 'Permission',
    render: (_, record) => <Tag color="green">{record.permission}</Tag>,
  },
  {
    title: 'Created On',
    render: (_, record) => <p>{moment(record.createdAt).calendar()}</p>,
  },
];
export default MenuColumn;
