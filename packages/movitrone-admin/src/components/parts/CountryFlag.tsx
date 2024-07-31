'use client';
import React from 'react';
import Image from 'next/image';
import { FC } from 'react';
import { getCountryFlag } from '@/Helpers/getCountryFlag';
import { iCountry } from '@/types/iCountry';

interface CountryFlagProps {
  country: iCountry;
  isActive?: boolean;
  children?: React.ReactNode;
}

const CountryFlag: FC<CountryFlagProps> = ({ country, children }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-start gap-2">
        <div className="h-20 w-14">
          {country?.code && (
            <Image
              height={100}
              width={100}
              className="h-20 w-32"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              src={getCountryFlag(country?.code as string)}
              alt={country as string}
            />
          )}
        </div>
        <div className="flex flex-col justify-center gap-1">
          <p className="whitespace-nowrap font-medium text-red-500">
            {`${country?.country} (${country?.code})`}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
};
export default CountryFlag;
