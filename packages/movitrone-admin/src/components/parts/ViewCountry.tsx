'use client';
import { getCountryByCode } from '@/Helpers/getCountry';
import { getCountryFlag } from '@/Helpers/getCountryFlag';
import Image from 'next/image';

const ViewCountry = ({ countryCode }: { countryCode: string }) => {
  const country = getCountryByCode(countryCode);
  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-start gap-2'>
        <div className='h-5 w-8'>
          {country?.code && (
            <Image
              height={100}
              width={100}
              className='h-5 w-8'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              src={getCountryFlag(country?.code)}
              alt={country?.country as string}
            />
          )}
        </div>
        <p className='font-medium text-red-500'>{country?.country}</p>
      </div>
    </div>
  );
};

export default ViewCountry;
