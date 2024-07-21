import { Select } from 'antd';
import React, { FC } from 'react';
import Countries from '../../../public/data/countries.json';
import { filterOption } from '../../Helpers/filterOptions';
interface SelectCountryProps {
  onSelect: (value: string) => void;
}

const SelectCountry: FC<SelectCountryProps> = ({ onSelect }) => {
  return (
    <Select
      showSearch
      placeholder='Select country ...'
      className='w-full'
      filterOption={filterOption}
      onSelect={(value) => onSelect(value)}
      options={Countries.map((item) => ({
        value: item.code,
        label: item.country,
      }))}
    />
  );
};

export default SelectCountry;
