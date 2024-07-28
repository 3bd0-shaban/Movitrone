import React from 'react';
import SeoCountryTable from '../(components)/Seo-Country.table';
import NewCountrySeo from '../(components)/New-CountrySeo';
export default async function SeoCountry() {
  return (
    <>
      <div className='card-shadows-slate-300 flex items-end justify-between pb-5'>
        <div className='flex flex-col gap-y-1'>
          <span className='text-xl font-semibold'>Seo Countries</span>
          <p className='text-xs font-medium text-gray-400'>{`Home - Seo - countries`}</p>
        </div>
        <NewCountrySeo />
      </div>
      <SeoCountryTable />
    </>
  );
}
