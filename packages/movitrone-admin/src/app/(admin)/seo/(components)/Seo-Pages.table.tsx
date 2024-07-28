'use client';
import { Button, Dropdown, Modal, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { FaChevronDown, FaUserMinus } from 'react-icons/fa';
import { usePagination } from '@/Hooks';
import { getError } from '@/Helpers/getError';
import {
  useDeleteSeoPageByIdMutation,
  useGetAllSeoPagesByCountryCodeQuery,
} from '@/services/APIs/seo/SeoPagesApi';
import { iSeoPage } from '@/types/seo/iSeoPage';
import SeoPageColumn from '@/components/Layouts/columns/seo-page.column';

const SeoPageTable: FC<{ countryCode: string }> = ({ countryCode }) => {
  const { data, isFetching, refetch } =
    useGetAllSeoPagesByCountryCodeQuery(countryCode);
  const { mutateAsync: DeleteSeoPage } = useDeleteSeoPageByIdMutation();
  const { totalCount, seos } = data || {};
  const [tableData, setTableData] = useState<iSeoPage>();
  const { tableParamsStore, handleTableChange } = usePagination(() => {
    refetch();
  });

  const [modal, contextHolder] = Modal.useModal();

  const HandleDeleteCountrySeo = () => {
    modal.confirm({
      title: 'Delete Seo Country',
      content: (
        <p>
          Are you shure you want to delete this page , it will view the main
          country seo in website insteed
        </p>
      ),
      maskClosable: true,
      onOk: (close) => {
        DeleteSeoPage({ SeoPageID: tableData?.id as number })
          .then(() => {
            close();
            toast.success(`admin deleted successfully`);
          })
          .catch((error: any) => {
            toast.error(getError(error));
          });
      },
      okText: 'Delete',
    });
  };

  const items: MenuProps['items'] = [
    {
      key: '3',
      danger: true,
      label: (
        <button
          onClick={HandleDeleteCountrySeo}
          className='flex gap-2 hover:text-white'
        >
          <FaUserMinus size={20} />
          Delete
        </button>
      ),
    },
  ];
  const columns: ColumnsType<iSeoPage> = [
    ...SeoPageColumn,
    {
      title: 'Action',
      render: (_, record) => (
        <Dropdown
          trigger={['click', 'hover']}
          menu={{ items }}
          overlayClassName='backdrop-blur-xl'
        >
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
      {contextHolder}
      <Table
        columns={columns}
        rowKey={(record) => record.id as number}
        dataSource={seos}
        loading={isFetching}
        pagination={{
          current: tableParamsStore?.pagination?.page,
          pageSize: tableParamsStore?.pagination?.limit,
          total: totalCount,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
        size='small'
      />
    </div>
  );
};

export default SeoPageTable;
