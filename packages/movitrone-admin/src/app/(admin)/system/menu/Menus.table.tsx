'use client';
import React, { FC, useState } from 'react';
import {
  Button,
  Divider,
  Modal,
  Space,
  Table,
  type TableColumnsType,
} from 'antd';
import { iMenu } from '@/types/system/iMenu';
import {
  useCreateNewMenuMutation,
  useDeleteMenuByIdMutation,
  useGetAllMenusQuery,
} from '@/services/APIs/system/MenuApi';
import MenusCreate from './Menus.create';
import { getMenuType } from '@/utils/getMenuType';
import { getError } from '@/Helpers/getError';
import { useForm } from 'react-hook-form';
import { useFeaturesStore } from '@/store/useFeaturesStore';
import MenuColumn from '@/components/Layouts/columns/menu.column';
import toast from 'react-hot-toast';
import { joiResolver } from '@hookform/resolvers/joi';
import { MenuSystemValidations } from '@/validations/system/menu.validations';

const MenusTable: FC = () => {
  const { data, isFetching } = useGetAllMenusQuery();
  const { mutateAsync } = useCreateNewMenuMutation();
  const { mutateAsync: DeleteMenu } = useDeleteMenuByIdMutation();
  const { set_Modal, isModal } = useFeaturesStore();
  const { control, setValue, watch, reset, handleSubmit } = useForm<iMenu>({
    defaultValues: { type: 0 },
    resolver: joiResolver(MenuSystemValidations.CreateMenu),
  });
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [modal, contextHook] = Modal.useModal();
  const transformedData = data?.map((item) => ({
    ...item,
    key: item.id,
    children: item.children?.map((child) => ({
      ...child,
      key: child.id,
    })),
  }));

  const OnSubmit = async (data: iMenu) => {
    await mutateAsync({ data })
      .then(() => {
        reset();
        set_Modal(false);
        toast.success(`New ${getMenuType(data.type)?.name} added Successully`);
      })
      .catch((error) => {
        toast.error(getError(error));
      });
  };

  const OnDelete = async (menuId: number) => {
    modal.confirm({
      title: 'Delete Menu',
      content:
        'Menu Can not be deleted if it was associated to role, continue ?',
      maskClosable: true,
      closeIcon: true,
      okText: 'Delete',
      onOk: async (close) => {
        await DeleteMenu({ menuId })
          .then(() => {
            toast.success(`menu deleted successfully`);
            close();
          })
          .catch((error) => {
            toast.error(getError(error));
          });
      },
    });
  };

  const columns: TableColumnsType<iMenu> = [
    ...MenuColumn,
    {
      title: 'Operate',
      fixed: 'right',
      render: (_, record) => (
        <Space split={<Divider type="vertical" />} align="center">
          <Button type="link">edit</Button>
          <Button
            type="link"
            onClick={() => set_Modal(true)}
            disabled={record.type === 2}
          >
            Added
          </Button>
          <Button type="link" onClick={() => OnDelete(record.id)}>
            delete
          </Button>
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
      {contextHook}
      <Modal
        open={isModal}
        onOk={handleSubmit((data) => OnSubmit(data))}
        onCancel={() => set_Modal(false)}
        okText="Confirm"
        cancelText="Cancel"
      >
        <MenusCreate
          menus={transformedData as any}
          control={control}
          setValue={setValue}
          watch={watch}
        />
      </Modal>
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
            <Button type="primary" onClick={() => set_Modal(true)}>
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
