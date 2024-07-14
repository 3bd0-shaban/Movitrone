import { iAdmin } from '@/types/user/iAdmin';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import UserPhoto from '../parts/UserPhoto';
import ViewCountry from '../parts/ViewCountry';

const userColumns: ColumnsType<iAdmin> = [
  {
    title: 'Basic Information',
    render: (_, record) => (
      <div className="flex items-center gap-2">
        <UserPhoto user={record as iAdmin} />
        <div className="flex flex-col">
          <p>{`${record.firstname} ${record.lastname}`}</p>
          <p className="text-sm text-gray-400">{record.email}</p>
        </div>
      </div>
    ),
  },
  {
    title: 'Office',
    dataIndex: '',
    key: 'name',
    render: (_, record) =>
      record.country ? (
        <ViewCountry countryCode={record.country as string} />
      ) : (
        <p>------</p>
      ),
  },
  {
    title: 'Phone Number',
    render: (_, record) => <p>{record?.phone}</p>,
  },
  {
    title: 'Goined At',
    render: (_, record) => <p>{moment(record?.createdAt).format('LL')}</p>,
  },
];
export default userColumns;
