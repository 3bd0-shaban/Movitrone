'use client';
import FormItem from '@/lib/FormItem';
import { useGetAllPermissionPathsQuery } from '@/services/APIs/system/MenuApi';
import { iMenu } from '@/types/system/iMenu';
import { formatPermission } from '@/utils/formatPermission';
import {
  Cascader,
  Form,
  Input,
  Radio,
  TreeSelect,
  type RadioChangeEvent,
} from 'antd';
import { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface MenusCreateProps {
  menus: iMenu[];
  control: UseFormReturn<iMenu>['control'];
  setValue: UseFormReturn<iMenu>['setValue'];
  watch: UseFormReturn<iMenu>['watch'];
}

const MenusCreate: FC<MenusCreateProps> = ({
  menus,
  control,
  setValue,
  watch,
}) => {
  const { data: permissions, isFetching } = useGetAllPermissionPathsQuery();

  const onRadioChange = (e: RadioChangeEvent) => {
    setValue('type', e.target.value);
  };

  const transformedMenus = [
    {
      title: 'Root Directory',
      value: 0,
      children: menus.map((item) => ({
        title: item.name,
        value: item.id,
        children:
          item.children?.map((child) => ({
            title: child.name,
            value: child.id,
          })) || [],
      })),
    },
  ];

  return (
    <Form layout="vertical">
      <p className="mb-3 text-lg font-mono">Create Menu or Permission</p>
      <div className="flex flex-col gap-3">
        <Radio.Group onChange={onRadioChange} value={watch('type')}>
          <Radio value={0}>Table Of Content</Radio>
          <Radio value={1}>Menu</Radio>
          <Radio value={2}>Permission</Radio>
        </Radio.Group>
        <FormItem control={control} name="name" label="Node Name" required>
          <Input placeholder="Enter Node Name" />
        </FormItem>
        <FormItem
          control={control}
          name="parentId"
          label="Parent Menu"
          required
        >
          <TreeSelect
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={transformedMenus}
            placeholder="Select Parent Menu"
            onChange={(value) => setValue('parentId', value)}
          />
        </FormItem>
        {watch('type') !== 0 && (
          <>
            <FormItem
              control={control}
              name="permission"
              label="Permission Flag"
              onChange={(value) => setValue('permission', value.join(':'))}
              required
            >
              <Cascader
                dropdownStyle={{ background: 'rgba(21, 31, 83, 0.5)' }}
                options={formatPermission(permissions as string[])}
                loading={isFetching}
                placeholder="Select permission"
              />
            </FormItem>
          </>
        )}
      </div>
    </Form>
  );
};

export default MenusCreate;
