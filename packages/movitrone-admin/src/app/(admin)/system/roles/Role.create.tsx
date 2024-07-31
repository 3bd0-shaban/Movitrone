'use client';
import FormItem from '@/lib/FormItem';
import { useGetAllMenusQuery } from '@/services/APIs/system/MenuApi';
import { iRole } from '@/types/system/iRole';
import { Form, Input, Radio, Spin, Tree } from 'antd';
import { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface RoleCreateProps {
  control: UseFormReturn<iRole>['control'];
  setValue: UseFormReturn<iRole>['setValue'];
}

const RoleCreate: FC<RoleCreateProps> = ({ control, setValue }) => {
  const { data, isFetching } = useGetAllMenusQuery();

  const transformedMenus = data?.map((item) => ({
    title: item.name,
    key: item.id,
    children:
      item.children?.map((child) => ({
        title: child.name,
        key: child.id,
        children: child.children?.map((smallChild) => ({
          title: smallChild.name,
          key: smallChild.id,
        })),
      })) || [],
  }));

  const getLastLevelKeys = (
    checkedKeys: (string | number)[],
    treeData: any[],
  ) => {
    const lastLevelKeys: (string | number)[] = [];

    const findLastLevelKeys = (nodes: any[]) => {
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          findLastLevelKeys(node.children);
        } else {
          if (checkedKeys.includes(node.key)) {
            lastLevelKeys.push(node.key);
          }
        }
      });
    };

    findLastLevelKeys(treeData);
    return lastLevelKeys;
  };

  return (
    <Form layout="vertical">
      <p className="mb-3 text-lg font-mono">Create Menu or Permission</p>
      <div className="flex flex-col gap-3">
        <FormItem control={control} name="name" label="Node Name" required>
          <Input placeholder="Enter Node Name" />
        </FormItem>
        <FormItem control={control} name="value" label="Node Name" required>
          <Input placeholder="Enter Role Value" />
        </FormItem>
        <FormItem control={control} name="status" label="Status" required>
          <Radio.Group onChange={(e) => setValue('status', e.target.value)}>
            <Radio value={1}>Enable</Radio>
            <Radio value={0}>Deactivate</Radio>
          </Radio.Group>
        </FormItem>

        <Form.Item name="menuIds" label="Menus Requireds" required>
          <div className="border border-black rounded-xl p-5 ">
            {isFetching ? (
              <Spin />
            ) : (
              <Tree
                checkable
                onCheck={(checkedKeys) => {
                  const lastLevelKeys = getLastLevelKeys(
                    checkedKeys as (string | number)[],
                    transformedMenus || [],
                  );
                  const checkedIds = lastLevelKeys.map((key) => Number(key));
                  setValue('menuIds', checkedIds);
                }}
                defaultExpandAll
                treeData={transformedMenus}
                blockNode
              />
            )}
          </div>
        </Form.Item>
      </div>
    </Form>
  );
};

export default RoleCreate;
