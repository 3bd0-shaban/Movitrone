'use client';
import React, { FC, useState } from 'react';
import {
  Button,
  Divider,
  Modal,
  Space,
  Table,
  Tag,
  type TableColumnsType,
} from 'antd';
import { iMenu } from '../../../../types/system/iMenu';
import { useGetAllMenusQuery } from '../../../../services/APIs/system/MenuApi';
import MenusCreate from './Menus.create';
import moment from 'moment';
import { getMenuType } from '@/utils/getMenuType';

interface MenusTableProps {}

const MenusTable: FC<MenusTableProps> = ({}) => {
  const { data, isFetching } = useGetAllMenusQuery();
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [modal, contextHolder] = Modal.useModal();

  const transformedData = data?.map((item) => ({
    ...item,
    key: item.id,
    children: item.children?.map((child) => ({
      ...child,
      key: child.id,
    })),
  }));

  const HandleAddNewMenu = () => {
    modal.confirm({
      title: 'Add Menu',
      content: <MenusCreate menus={transformedData as any} />,
      maskClosable: true,
      icon: <></>,
      width: 700,
      footer: false,
    });
  };
  const columns: TableColumnsType<iMenu> = [
    {
      title: 'Full Name',
      fixed: 'left',
      width: 200,
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
    // {
    //   title: 'Keep Alive',
    //   render: (_, record) => (
    //     <Tag color={record.keepAlive === 1 ? 'green' : 'red'}>
    //       {record.keepAlive === 1 ? 'true' : 'false'}
    //     </Tag>
    //   ),
    // },
    {
      title: 'Operate',
      fixed: 'right',
      render: (_, record) => (
        <Space split={<Divider type="vertical" />} align="center">
          <Button type="link">edit</Button>
          <Button
            type="link"
            onClick={HandleAddNewMenu}
            disabled={record.type === 2}
          >
            Added
          </Button>
          <Button type="link">delete</Button>
        </Space>
      ),
    },
  ];

  const handleExpandAll = () => {
    const allKeys = transformedData?.flatMap((item) => [
      item.key,
      ...(item.children?.map((child) => child.key) || []),
    ]);
    setExpandedRowKeys(allKeys || []);
  };

  return (
    <div className="flex flex-col gap-5">
      {contextHolder}
      <div className="blured-card"></div>
      <div className="blured-card">
        <div className="flex justify-between my-3">
          <div className="flex gap-5">
            <p>Menu Management</p>
            <div className="flex gap-5">
              <Button onClick={handleExpandAll}>Expand All</Button>
              <Button onClick={() => setExpandedRowKeys([])}>
                Collapse All
              </Button>
            </div>
          </div>
          <div className="flex">
            <Button type="primary" onClick={HandleAddNewMenu}>
              Added
            </Button>
          </div>
        </div>
        <Table
          columns={columns}
          loading={isFetching}
          pagination={false}
          dataSource={transformedData}
          scroll={{ x: 1600 }}
          size="small"
          expandable={{
            expandedRowKeys: expandedRowKeys,
            onExpand: (expanded, record) => {
              setExpandedRowKeys(
                expanded
                  ? [...expandedRowKeys, record.key]
                  : expandedRowKeys.filter((key) => key !== record.key),
              );
            },
          }}
        />
      </div>
    </div>
  );
};

export default MenusTable;
