import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiEndpoint } from '../../ApiEndpoint';
import { iAdmin, iRole } from '@/types/user/iAdmin';
import { useTableParamsStore } from '@/store/useTableParamsStore';

const url = process.env.NEXT_PUBLIC_API_KEY;

export function useGetAllAdminsQuery({ role }: { role: iRole }) {
  const queryClient = useQueryClient();
  const { pagination } = useTableParamsStore();

  return useQuery({
    refetchOnWindowFocus: false,
    queryFn: () =>
      ApiEndpoint<{ users: iAdmin[]; totalCount: number; results: number }>(
        {
          method: 'GET',
          url: `${url}/api/admin/role/${role}?page=${pagination.page}&limit=${pagination.limit}`,
        },
        queryClient,
      ),
    queryKey: ['Admin', pagination, role],
  });
}

export function useGetSelfAccountQuery() {
  const queryClient = useQueryClient();

  return useQuery({
    refetchOnWindowFocus: false,
    queryFn: () =>
      ApiEndpoint<iAdmin>(
        {
          method: 'GET',
          url: `${url}/api/admin/get/self`,
        },
        queryClient,
      ),
    queryKey: ['Admin'],
  });
}

export function useGetAdminByIdQuery({ adminId }: { adminId: number }) {
  const queryClient = useQueryClient();

  return useQuery({
    refetchOnWindowFocus: false,
    queryFn: () =>
      ApiEndpoint<iAdmin>(
        {
          method: 'GET',
          url: `${url}/api/admin/get-by-id/${adminId}`,
        },
        queryClient,
      ),
    queryKey: ['Admin', adminId],
  });
}

export function useCreateNewAdminMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: iAdmin }) =>
      ApiEndpoint<void>(
        {
          method: 'POST',
          url: `${url}/api/admin/create-Admin/`,
          data,
        },
        queryClient,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Admin'] });
    },
  });
}
export function useUpdateAdminByIdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, adminId }: { data: iAdmin; adminId: number }) =>
      ApiEndpoint<void>(
        {
          method: 'PUT',
          url: `${url}/api/admin/update-by-id/${adminId}`,
          data,
        },
        queryClient,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Admin'] });
    },
  });
}

export function useDeleteAdminByIdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ adminId }: { adminId: number }) =>
      ApiEndpoint<void>(
        {
          method: 'PUT',
          url: `${url}/api/admin/delete-by-id/${adminId}`,
        },
        queryClient,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Admin'] });
    },
  });
}
export function useUpdateAdminPasswordByIdMutations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, adminId }: { data: iAdmin; adminId: number }) =>
      ApiEndpoint<void>(
        {
          method: 'PUT',
          url: `${url}/api/admin/update-by-id/${adminId}/passwword`,
          data: data,
        },
        queryClient,
      ),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ['Admin'],
      });
    },
  });
}
