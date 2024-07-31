'use client';
import { getError } from '@/Helpers/getError';
import FormItem from '@/lib/FormItem';
import {
  useCreateNewMenuMutation,
  useGetAllNextJsAppPathsQuery,
  useGetAllPermissionPathsQuery,
} from '@/services/APIs/system/MenuApi';
import { iMenu } from '@/types/system/iMenu';
import { formatPermission } from '@/utils/formatPermission';
import { getMenuType } from '@/utils/getMenuType';
import {
  Button,
  Cascader,
  Form,
  Input,
  Radio,
  TreeSelect,
  type RadioChangeEvent,
} from 'antd';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface MenusCreateProps {
  menus: iMenu[];
}

const MenusCreate: FC<MenusCreateProps> = ({ menus }) => {
  const { control, setValue, watch, handleSubmit } = useForm<iMenu>({
    defaultValues: { type: 0 },
  });
  const { data: permissions, isFetching } = useGetAllPermissionPathsQuery();
  //   const { data: SystemPaths, isFetching: FetchSystemPaths } =
  //     useGetAllNextJsAppPathsQuery();
  const { mutateAsync } = useCreateNewMenuMutation();

  const onRadioChange = (e: RadioChangeEvent) => {
    setValue('type', e.target.value);
  };

  const onTreeSelectChange = (value: any) => {
    setValue('parentId', value);
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

  const OnSubmit = (data: iMenu) => {
    const permission = (data?.permission as any)?.join(':');
    mutateAsync({ data: { ...data, permission } })
      .then(() => {
        toast.success(`New ${getMenuType(data.type)?.name} added Successully`);
      })
      .catch((error) => {
        toast.error(getError(error));
      });
  };

  return (
    <Form onFinish={handleSubmit(OnSubmit)}>
      <div className="flex flex-col gap-5">
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
            onChange={onTreeSelectChange}
          />
        </FormItem>
        {watch('type') !== 0 && (
          <>
            <FormItem
              control={control}
              name="permission"
              label="Permission Flag"
              required
            >
              <Cascader
                dropdownStyle={{ background: 'rgba(21, 31, 83, 0.5)' }}
                options={formatPermission(permissions as string[])}
                loading={isFetching}
                placeholder="Select permission"
              />
            </FormItem>

            {/* <FormItem
            control={control}
            name="permission"
            label="URL Path"
            required
          >
            <Cascader
              dropdownStyle={{ background: 'rgba(21, 31, 83, 0.5)' }}
              options={formatPermission(SystemPaths as string[])}
              loading={FetchSystemPaths}
              placeholder="Select permission"
            />
          </FormItem> */}
          </>
        )}
        <div className="w-full flex justify-end gap-5">
          <Button type="default">Cancel</Button>
          <Button htmlType="submit" type="primary">
            Confirm Adding
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default MenusCreate;
