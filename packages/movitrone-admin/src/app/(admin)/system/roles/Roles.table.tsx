'use client'
import React, { FC } from 'react';
import { Table, type TableColumnsType } from 'antd';
import { iMenu } from '../../../../types/system/iMenu';
import { useGetAllMenusQuery } from '../../../../services/APIs/system/MenuApi';

interface RolesTableProps {}

const RolesTable: FC<RolesTableProps> = ({}) => {
  const { data } = useGetAllMenusQuery();

  const columns: TableColumnsType<iMenu> = [
    {
      title: 'Full Name',
      width: 100,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
    },
    {
      title: 'Age',
      width: 100,
      dataIndex: 'age',
      key: 'age',
      fixed: 'left',
    },
    { title: 'Column 1', dataIndex: 'address', key: '1' },
    { title: 'Column 2', dataIndex: 'address', key: '2' },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: () => <a>action</a>,
    },
  ];
  return <Table columns={columns} dataSource={data} scroll={{ x: 1300 }} />;
};

export default RolesTable;
