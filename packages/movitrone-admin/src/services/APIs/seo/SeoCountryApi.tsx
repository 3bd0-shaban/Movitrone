import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiEndpoint } from '../../ApiEndpoint';
import { iSeoCountry } from '../../../types/seo/iSeoCountry';
import { useTableParamsStore } from '@/store/useTableParamsStore';

const url = process.env.NEXT_PUBLIC_API_KEY;

export function useGetAllSeoCountriesQuery() {
  const { pagination } = useTableParamsStore();

  return useQuery({
    refetchOnWindowFocus: false,
    queryFn: () =>
      ApiEndpoint<{
        seos: iSeoCountry[];
        totalCount: number;
        results: number;
      }>({
        method: 'GET',
        url: `${url}/api/Seo-country?page=${pagination.page}&limit=${pagination.limit}`,
      }),
    queryKey: ['SeoCountry', pagination],
  });
}

export function useGetCountrySeoByCountryCode(countryCode: string) {
  return useQuery({
    refetchOnWindowFocus: false,
    queryFn: () =>
      ApiEndpoint<iSeoCountry>({
        method: 'GET',
        url: `${url}/api/seo-country/get/${countryCode}`,
      }),
    queryKey: ['SeoCountry'],
  });
}

export function useCreateNewSeoCountryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ country }: { country: string }) =>
      ApiEndpoint<void>({
        method: 'POST',
        url: `${url}/api/seo-country`,
        data: { country },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['SeoCountry'] });
    },
  });
}

export function useMarkSeoCountryAsMainByIdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ countryCode }: { countryCode: string }) =>
      ApiEndpoint<void>({
        method: 'PUT',
        url: `${url}/api/seo-country/main/${countryCode}`,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['SeoCountry'] });
    },
  });
}

export function useDeleteSeoCountryByIdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ countryCode }: { countryCode: string }) =>
      ApiEndpoint<void>({
        method: 'DELETE',
        url: `${url}/api/seo-country/delete/${countryCode}`,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['SeoCountry'] });
    },
  });
}
