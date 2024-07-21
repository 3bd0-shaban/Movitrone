'use client';
import { Button, Dropdown, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import { FC, useState } from 'react';
import { iAdmin, iRole } from '@/types/user/iAdmin';
import toast from 'react-hot-toast';
import { FaChevronDown, FaEye, FaUserMinus } from 'react-icons/fa';
import Link from 'next/link';
import { usePagination } from '@/Hooks';
import { getError } from '@/Helpers/getError';
import userColumns from '@/components/Layouts/columns/users.column';
import { PiEye } from 'react-icons/pi';
import {
  useDeleteAdminByIdMutation,
  useGetAllAdminsQuery,
  useUpdateAdminByIdMutation,
} from '@/services/APIs/user/AdminApi';

const UsersTable: FC<{ role: iRole }> = ({ role }) => {
  const { data, isFetching, refetch } = useGetAllAdminsQuery({ role });
  const { mutateAsync: mutateUpdate } = useUpdateAdminByIdMutation();
  const { mutateAsync: mutateDelete } = useDeleteAdminByIdMutation();
  const { totalCount, users } = data || {};
  const [tableData, setTableData] = useState<iAdmin>();
  const { tableParamsStore, handleTableChange } = usePagination(() => {
    refetch();
  });

  const HandleDeleteUser = (formdata: iAdmin) => {
    mutateDelete({ adminId: formdata.id as number })
      .then(() => {
        toast.success(`admin deleted successfully`);
      })
      .catch((error) => {
        toast.error(getError(error));
      });
  };
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link
          href={`${tableData?.id}/open-tickets`}
          draggable={false}
          className='flex h-full w-full items-center justify-start gap-2 text-red-500'
        >
          <PiEye size={17} />
          <p>View</p>
        </Link>
      ),
    },
    {
      key: '1-1',
      label: (
        <Link
          href={`${tableData?.id}/analytics`}
          draggable={false}
          className='flex h-full w-full items-center justify-start gap-2 text-red-500'
        >
          <FaEye size={17} />
          <p>View Analytics</p>
        </Link>
      ),
    },
    {
      key: '4',
      danger: true,
      label: (
        <button
          onClick={() => HandleDeleteUser(tableData as iAdmin)}
          className='flex gap-2 hover:text-white'
        >
          <FaUserMinus size={20} />
          Delete
        </button>
      ),
    },
  ];
  const columns: ColumnsType<iAdmin> = [
    ...userColumns,
    {
      title: 'Action',
      render: (_, record) => (
        <Dropdown
          trigger={['click', 'hover']}
          menu={{ items }}
          overlayClassName='backdrop-blur-xl'
        >
          <Button
            onClick={(e) => {
              e.preventDefault();
              setTableData(record);
            }}
          >
            <Space>
              Actions
              <FaChevronDown size={18} />
            </Space>
          </Button>
        </Dropdown>
      ),
    },
  ];
  return (
    <div className='card-shadows-slate-300 overflow-hidden !p-0'>
      <Table
        columns={columns}
        rowKey={(record) => record.id as number}
        dataSource={users}
        loading={isFetching}
        pagination={{
          current: tableParamsStore?.pagination?.page,
          pageSize: tableParamsStore?.pagination?.limit,
          total: totalCount,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
        size='middle'
      />
    </div>
  );
};

export default UsersTable;
