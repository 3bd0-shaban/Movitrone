import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiEndpoint } from '../../ApiEndpoint';
import { iAdmin, iRoleEnum } from '@/types/user/iAdmin';
import { useTableParamsStore } from '@/store/useTableParamsStore';

const url = process.env.NEXT_PUBLIC_API_KEY;

export function useGetAllAdminsQuery({ role }: { role: iRoleEnum }) {
  const { pagination } = useTableParamsStore();

  return useQuery({
    refetchOnWindowFocus: false,
    queryFn: () =>
      ApiEndpoint<{ users: iAdmin[]; totalCount: number; results: number }>({
        method: 'GET',
        url: `${url}/api/admin/role/${role}?page=${pagination.page}&limit=${pagination.limit}`,
      }),
    queryKey: ['Admin', pagination, role],
  });
}

export function useGetSelfAccountQuery() {
  return useQuery({
    refetchOnWindowFocus: false,
    queryFn: () =>
      ApiEndpoint<iAdmin>({
        method: 'GET',
        url: `${url}/api/admin`,
      }),
    queryKey: ['Admin'],
  });
}

export function useGetAdminByIdQuery({ adminId }: { adminId: number }) {
  return useQuery({
    refetchOnWindowFocus: false,
    queryFn: () =>
      ApiEndpoint<iAdmin>({
        method: 'GET',
        url: `${url}/api/admin/get-by-id/${adminId}`,
      }),
    queryKey: ['Admin', adminId],
  });
}

export function useCreateNewAdminMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: iAdmin }) =>
      ApiEndpoint<void>({
        method: 'POST',
        url: `${url}/api/admin/create-Admin/`,
        data,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Admin'] });
    },
  });
}
export function useUpdateAdminByIdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, adminId }: { data: iAdmin; adminId: number }) =>
      ApiEndpoint<void>({
        method: 'PUT',
        url: `${url}/api/admin/update-by-id/${adminId}`,
        data,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Admin'] });
    },
  });
}

export function useDeleteAdminByIdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ adminId }: { adminId: number }) =>
      ApiEndpoint<void>({
        method: 'PUT',
        url: `${url}/api/admin/delete-by-id/${adminId}`,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Admin'] });
    },
  });
}
export function useUpdateAdminPasswordByIdMutations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, adminId }: { data: iAdmin; adminId: number }) =>
      ApiEndpoint<void>({
        method: 'PUT',
        url: `${url}/api/admin/update-by-id/${adminId}/passwword`,
        data: data,
      }),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ['Admin'],
      });
    },
  });
}
