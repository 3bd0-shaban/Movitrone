import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiEndpoint } from '../../ApiEndpoint';
import { iRole } from '@/types/system/iRole';
import { iMeta } from '@/types/iMeta';

const url = process.env.NEXT_PUBLIC_API_KEY;

export function useGetAllRolesQuery() {
  return useQuery({
    refetchOnWindowFocus: false,
    queryFn: () =>
      ApiEndpoint<{ items: iRole[]; meta: iMeta }>({
        method: 'GET',
        url: `${url}/api/system/roles`,
      }),
    queryKey: ['Role'],
  });
}

export function useGetRoleByIdQuery(roleId: number) {
  return useQuery({
    refetchOnWindowFocus: false,
    queryFn: () =>
      ApiEndpoint<iRole>({
        method: 'GET',
        url: `${url}/api/system/roles/get/${roleId}`,
      }),
    queryKey: ['Role', roleId],
  });
}

export function useCreateNewRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: iRole }) =>
      ApiEndpoint<void>({
        method: 'POST',
        url: `${url}/api/system/roles`,
        data,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Role'] });
    },
  });
}

export function useUpdateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, data }: { roleId: number; data: iRole }) =>
      ApiEndpoint<void>({
        method: 'PUT',
        url: `${url}/api/system/roles/${roleId}`,
        data,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Role'] });
    },
  });
}

export function useDeleteRoleByIdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId }: { roleId: number }) =>
      ApiEndpoint<void>({
        method: 'DELETE',
        url: `${url}/api/system/roles/${roleId}`,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Role'] });
    },
  });
}
