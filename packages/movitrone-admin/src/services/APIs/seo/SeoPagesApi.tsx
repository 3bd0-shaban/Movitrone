import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiEndpoint } from '../../ApiEndpoint';
import { iSeoPage } from '../../../types/seo/iSeoPage';
import { useTableParamsStore } from '@/store/useTableParamsStore';

const url = process.env.NEXT_PUBLIC_API_KEY;

export function useGetAllSeoPagesByCountryCodeQuery(countryCode: string) {
  const { pagination } = useTableParamsStore();

  return useQuery({
    refetchOnWindowFocus: false,
    queryFn: () =>
      ApiEndpoint<{
        seos: iSeoPage[];
        totalCount: number;
        results: number;
      }>({
        method: 'GET',
        url: `${url}/api/Seo-page/country/${countryCode}?page=${pagination.page}&limit=${pagination.limit}`,
      }),
    queryKey: ['Seopage', pagination],
  });
}

export function useGetSeoPageById(seoPageID: string) {
  return useQuery({
    refetchOnWindowFocus: false,
    queryFn: () =>
      ApiEndpoint<iSeoPage>({
        method: 'GET',
        url: `${url}/api/seo-page/get/${seoPageID}`,
      }),
    queryKey: ['Seopage'],
  });
}

export function useCreateNewSeoPageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: iSeoPage }) =>
      ApiEndpoint<void>({
        method: 'POST',
        url: `${url}/api/seo-page`,
        data,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Seopage'] });
    },
  });
}

export function useUpdateSeoPageByIdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ SeoPageID }: { SeoPageID: number }) =>
      ApiEndpoint<void>({
        method: 'PUT',
        url: `${url}/api/seo-page/update/${SeoPageID}`,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Seopage'] });
    },
  });
}

export function useDeleteSeoPageByIdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ SeoPageID }: { SeoPageID: number }) =>
      ApiEndpoint<void>({
        method: 'DELETE',
        url: `${url}/api/seo-page/delete/${SeoPageID}`,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Seopage'] });
    },
  });
}
