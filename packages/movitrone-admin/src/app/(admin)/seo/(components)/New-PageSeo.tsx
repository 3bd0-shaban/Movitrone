'use client';
import { Button, Modal } from 'antd';
import React, { FC, useState, useRef, useEffect } from 'react';
import { useCreateNewSeoCountryMutation } from '../../../../services/APIs/seo/SeoCountryApi';
import SelectCountry from '@/components/parts/SelectCountry';
import { getError } from '@/Helpers/getError';
import toast from 'react-hot-toast';

interface NewCountrySeoProps {}

const NewCountrySeo: FC<NewCountrySeoProps> = ({}) => {
  const { mutateAsync: NewCountrySeo } = useCreateNewSeoCountryMutation();
  const [countrySelected, setSelectedCountry] = useState<string>('');
  const countrySelectedRef = useRef<string>('');
  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    countrySelectedRef.current = countrySelected;
  }, [countrySelected]);

  const HandleNewCountry = async () => {
    setSelectedCountry('');
    return modal.confirm({
      title: 'Creating New Country Seo',
      content: (
        <SelectCountry onSelect={(value) => setSelectedCountry(value)} />
      ),
      onOk: async (close) => {
        if (!countrySelectedRef.current) {
          toast.error('Please select a country before proceeding.');
          return Promise.reject();
        }
        try {
          await NewCountrySeo({ country: countrySelectedRef.current });
          close();
        } catch (error) {
          toast.error(getError(error));
        }
      },
      maskAnimation: true,
      maskClosable: true,
    });
  };

  return (
    <>
      {contextHolder}
      <Button onClick={HandleNewCountry}>New Country</Button>
    </>
  );
};

export default NewCountrySeo;
