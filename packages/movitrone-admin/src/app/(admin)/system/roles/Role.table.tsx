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
import { iRole } from '@/types/system/iRole';

import RoleCreate from './Role.create';
import { getError } from '@/Helpers/getError';
import { useForm } from 'react-hook-form';
import { useFeaturesStore } from '@/store/useFeaturesStore';
import toast from 'react-hot-toast';
import {
  useCreateNewRoleMutation,
  useDeleteRoleByIdMutation,
  useGetAllRolesQuery,
} from '@/services/APIs/system/RoleApi';
import RoleMenu from '@/components/Layouts/columns/role.column';
import { joiResolver } from '@hookform/resolvers/joi';
import { RoleSystemValidations } from '@/validations/system/role.validations';

const RoleTable: FC = () => {
  const { data, isFetching } = useGetAllRolesQuery();
  const { items } = data || {};
  const { mutateAsync } = useCreateNewRoleMutation();
  const { mutateAsync: DeleteMenu } = useDeleteRoleByIdMutation();
  const { set_Modal, isModal } = useFeaturesStore();
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<iRole>({
    resolver: joiResolver(RoleSystemValidations.CreateRole),
  });

  const [modal, contextHook] = Modal.useModal();
  console.log(errors);
  const OnSubmit = async (data: iRole) => {
    await mutateAsync({
      data,
    })
      .then(() => {
        toast.success(`Role is Successully`);
        reset();
        set_Modal(false);
      })
      .catch((error) => {
        toast.error(getError(error));
      });
  };

  const OnDelete = async (roleId: number) => {
    modal.confirm({
      title: 'Delete Role',
      content:
        'Role Can not be deleted if there was associated users to this role, continue ?',
      maskClosable: true,
      closeIcon: true,
      okText: 'Delete',
      onOk: async (close) => {
        await DeleteMenu({ roleId })
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

  const columns: TableColumnsType<iRole> = [
    ...RoleMenu,
    {
      title: 'Operate',
      width: 200,
      render: (_, record) => (
        <Space split={<Divider type="vertical" />} align="center">
          <Button type="link">edit</Button>
          <Button type="link" onClick={() => OnDelete(record.id)}>
            delete
          </Button>
        </Space>
      ),
    },
  ];

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
        <RoleCreate control={control} setValue={setValue} />
      </Modal>
      <div className="blured-card"></div>
      <div className="blured-card">
        <div className="flex justify-between my-3">
          <p>Roles Management</p>
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
          dataSource={items}
          size="small"
        />
      </div>
    </div>
  );
};

export default RoleTable;
