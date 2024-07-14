'use client';
import { Button, Input, Modal } from 'antd';
import React, { FC, useState } from 'react';
import { useCreateNewSeoCountryMutation } from '../../../../services/APIs/seo/SeoCountryApi';
import SelectCountry from '../../../../components/parts/SelectCountry';

interface NewCountrySeoProps {}

const NewCountrySeo: FC<NewCountrySeoProps> = ({}) => {
  const { mutateAsync: NewCountrySeo } = useCreateNewSeoCountryMutation();
  const [countrySelected, setSelectedCountry] = useState<string>('');
  const HandleNewCountry = async () => {
    return Modal.confirm({
      title: 'Creating New Country Seo',
      content: (
        <SelectCountry onSelect={(value) => setSelectedCountry(value)} />
      ),
      onOk: async () => {
        return await NewCountrySeo({ country: countrySelected });
      },
    });
  };

  return (
    <div>
      <Button onClick={HandleNewCountry}>New Country</Button>
    </div>
  );
};

export default NewCountrySeo;
