'use client';
import { Button, Dropdown, Space, Table } from 'antd';
import type { MenuProps } from 'antd';
import { FC, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { getError } from '@/Helpers/getError';

import { usePagination } from '@/Hooks';
import { iUser } from '@/types/user/iUser';
import {
  useDeleteUserByIdMutation,
  useGetAllUsersQuery,
  useUpdateUserByIdMutation,
} from '@/services/APIs/user/UserApi';
import {
  FaAccessibleIcon,
  FaCheck,
  FaChevronDown,
  FaEye,
  FaUserMinus,
} from 'react-icons/fa';
import userColumns from '@/components/Layouts/columns/users.column';

const WebsiteUsers: FC = ({}) => {
  const { data, isFetching, refetch } = useGetAllUsersQuery();
  const { tableParamsStore, handleTableChange } = usePagination(() => {
    refetch();
  });
  const { users, totalCount } = data || {};
  const [tableData, setTableData] = useState<iUser>();
  const { mutateAsync: mutateUpdate } = useUpdateUserByIdMutation();
  const { mutateAsync: mutateDelete } = useDeleteUserByIdMutation();

  const HandleBlockUser = (formdata: iUser) => {
    mutateUpdate({
      data: { is_Blocked: !formdata?.is_Blocked },
      userId: formdata?.id as number,
    })
      .then(() => {
        toast.success(`user Blocked`);
      })
      .catch((error) => {
        toast.error(`Failed to block user`);
      });
  };

  const HandleVerified = (formdata: iUser) => {
    if (formdata.is_Verified) {
      return toast.error(
        `${formdata.firstname} ${formdata.lastname} already verified`,
      );
    }
    mutateUpdate({
      data: { is_Verified: true },
      userId: formdata?.id as number,
    })
      .then(() => {
        toast.success(`user Verified successfully`);
      })
      .catch((error) => {
        toast.error(getError(error));
      });
  };
  const HandleDeleteUser = (formdata: iUser) => {
    mutateDelete({ userId: formdata.id as number })
      .then(() => {
        toast.success(`user deleted successfully`);
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
          href={`${tableData?.id as number}/book-ticket`}
          draggable={false}
          className='flex h-full w-full items-center justify-start gap-2 text-red-500'
        >
          <FaEye size={17} />
          <p>View</p>
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <button
          onClick={() => HandleBlockUser(tableData as iUser)}
          className='flex justify-start text-red-500'
        >
          Block
        </button>
      ),
      icon: <FaAccessibleIcon />,
    },
    {
      key: '3',
      label: (
        <button
          onClick={() => HandleVerified(tableData as iUser)}
          className='flex justify-start text-red-500'
        >
          Mark as Verified
        </button>
      ),
      icon: <FaCheck />,
    },
    {
      key: '4',
      danger: true,
      label: (
        <button
          onClick={() => HandleDeleteUser(tableData as iUser)}
          className='flex gap-2 hover:text-white'
        >
          <FaUserMinus size={20} />
          Delete
        </button>
      ),
    },
  ];
  let ExtraEmployeeColumn: ColumnsType<iUser> = [
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Dropdown menu={{ items }} placement='bottomRight'>
          <Button
            onMouseEnter={(e) => {
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
        columns={[...userColumns, ...ExtraEmployeeColumn]}
        rowKey={(record) => record.id as number}
        scroll={{ x: 1000 }}
        size='middle'
        dataSource={users}
        pagination={{
          current: tableParamsStore?.pagination?.page,
          pageSize: tableParamsStore?.pagination?.limit,
          total: totalCount,
        }}
        loading={isFetching}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default WebsiteUsers;
