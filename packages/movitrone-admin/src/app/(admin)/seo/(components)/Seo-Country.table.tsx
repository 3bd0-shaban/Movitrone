'use client';
import { Button, Dropdown, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { FaChevronDown, FaUserMinus } from 'react-icons/fa';
import Link from 'next/link';
import { usePagination } from '@/Hooks';
import { getError } from '@/Helpers/getError';
import { PiEye } from 'react-icons/pi';
import {
  useGetAllSeoCountriesQuery,
  useDeleteSeoCountryByIdMutation,
  useMarkSeoCountryAsMainByIdMutation,
} from '@/services/APIs/seo/SeoCountryApi';
import { iSeoCountry } from '@/types/seo/iSeoCountry';
import SeoCountryColumn from '@/components/Layouts/columns/seo-country.column';

const SeoCountryTable: FC = ({}) => {
  const { data, isFetching, refetch } = useGetAllSeoCountriesQuery();
  const { mutateAsync: markAsMain } = useMarkSeoCountryAsMainByIdMutation();
  const { mutateAsync: DeleteSeoPage } = useDeleteSeoCountryByIdMutation();
  const { totalCount, seos } = data || {};
  const [tableData, setTableData] = useState<iSeoCountry>();
  const { tableParamsStore, handleTableChange } = usePagination(() => {
    refetch();
  });

  const HandleDeleteCountrySeo = (formdata: iSeoCountry) => {
    DeleteSeoPage({ countryCode: formdata.country as string })
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
          href={`/seo/country/pages/${tableData?.country}`}
          draggable={false}
          className="flex h-full w-full items-center justify-start gap-2 text-red-500"
        >
          <PiEye size={17} />
          <p>View Pages</p>
        </Link>
      ),
    },
    {
      key: '4',
      danger: true,
      label: (
        <button
          onClick={() =>
            markAsMain({ countryCode: tableData?.country as string })
          }
          className="flex gap-2 hover:text-white"
        >
          <FaUserMinus size={20} />
          Mark As Main
        </button>
      ),
    },
    {
      key: '4',
      danger: true,
      label: (
        <button
          onClick={() => HandleDeleteCountrySeo(tableData as iSeoCountry)}
          className="flex gap-2 hover:text-white"
        >
          <FaUserMinus size={20} />
          Delete
        </button>
      ),
    },
  ];
  const columns: ColumnsType<iSeoCountry> = [
    ...SeoCountryColumn,
    {
      title: 'Action',
      render: (_, record) => (
        <Dropdown
          trigger={['click', 'hover']}
          menu={{ items }}
          overlayClassName="backdrop-blur-xl"
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
    <div className="card-shadows-slate-300 overflow-hidden !p-0">
      <Table
        columns={columns}
        rowKey={(record) => record.country as string}
        dataSource={seos}
        loading={isFetching}
        pagination={{
          current: tableParamsStore?.pagination?.page,
          pageSize: tableParamsStore?.pagination?.limit,
          total: totalCount,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
        size="middle"
      />
    </div>
  );
};

export default SeoCountryTable;
