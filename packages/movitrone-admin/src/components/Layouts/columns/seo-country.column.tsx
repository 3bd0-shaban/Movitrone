import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { iSeoCountry } from '@/types/seo/iSeoCountry';
import { getCountryByCode } from '@/Helpers/getCountry';
import CountryFlag from '@/components/parts/CountryFlag';
import { iCountry } from '@/types/iCountry';
import { Tag } from 'antd';
const SeoCountryColumn: ColumnsType<iSeoCountry> = [
  {
    title: 'Country',
    render: (_, record) => (
      <CountryFlag
        country={getCountryByCode(record.country as string) as iCountry}
      />
    ),
  },
  {
    title: 'Is Main',
    render: (_, record) =>
      record.is_Main ? (
        <Tag color="green">True</Tag>
      ) : (
        <Tag color="red">False</Tag>
      ),
  },
  {
    title: 'Created At',
    render: (_, record) => <p>{moment(record?.createdAt).format('LL')}</p>,
  },
];
export default SeoCountryColumn;
