import { getCountryCode } from '@/Helpers/getCountry';
import React from 'react';
import SeoPageTable from '../../(components)/Seo-Pages.table';
export default async function Users({
  params,
}: {
  params: { country: string };
}) {
  const roles = [
    { params: 'admins', role: 'Admin' },
    { params: 'super-admins', role: 'Super Admin' },
  ];
  const countryCode = getCountryCode(params.country)?.code;
  return (
    <>
      <div className='card-shadows-slate-300 flex items-end justify-between pb-5'>
        <div className='flex flex-col gap-y-1'>
          <span className='text-xl font-semibold'>Seo Pages</span>
          <p className='text-xs font-medium text-gray-400'>{`Home - Seo - Pages`}</p>
        </div>
        {/* <NewClient /> */}
      </div>
      <SeoPageTable countryCode={countryCode as string} />
    </>
  );
}
