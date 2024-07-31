import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { iSeoPage } from '@/types/seo/iSeoPage';
import { Tag } from 'antd';

const SeoPageColumn: ColumnsType<iSeoPage> = [
  {
    title: 'ID',
    render: (_, record) => <p>{record.id}</p>,
  },
  {
    title: 'Title',
    render: (_, record) => <p>{record.tag_Title}</p>,
  },
  {
    title: 'Description',
    width: 100,
    render: (_, record) => (
      <p className="ellipse-2">{record.tag_Description}</p>
    ),
  },
  {
    title: 'Seo Status',
    render: (_, record) =>
      record.Seo_Status == 'Optimized' ? (
        <Tag color="green">Optimized</Tag>
      ) : (
        <Tag color="red">Not Optimized</Tag>
      ),
  },
  {
    title: 'Created At',
    render: (_, record) => <p>{moment(record?.createdAt).format('LL')}</p>,
  },
];
export default SeoPageColumn;
