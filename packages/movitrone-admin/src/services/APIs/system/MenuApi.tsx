import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiEndpoint } from '../../ApiEndpoint';
import { iMenu } from '../../../types/system/iMenu';

const url = process.env.NEXT_PUBLIC_API_KEY;

export function useGetAllMenusQuery() {
  return useQuery({
    refetchOnWindowFocus: false,
    queryFn: () =>
      ApiEndpoint<iMenu[]>({
        method: 'GET',
        url: `${url}/api/system/menus`,
      }),
    queryKey: ['Menu'],
  });
}

export function useGetMenuPermissionQuery(menuId: number) {
  return useQuery({
    refetchOnWindowFocus: false,
    queryFn: () =>
      ApiEndpoint<iMenu>({
        method: 'GET',
        url: `${url}/api/system/menus/get/${menuId}`,
      }),
    queryKey: ['Menu', menuId],
  });
}

export function useGetAllPermissionPathsQuery() {
  return useQuery({
    refetchOnWindowFocus: false,
    queryFn: () =>
      ApiEndpoint<string[]>({
        method: 'GET',
        url: `${url}/api/system/menus/permissions`,
      }),
    queryKey: ['Permissions'],
  });
}

export function useGetAllNextJsAppPathsQuery() {
  return useQuery({
    refetchOnWindowFocus: false,
    queryFn: () =>
      ApiEndpoint<string[]>({
        method: 'GET',
        url: `/api/routes`,
      }),
    queryKey: ['routes'],
  });
}
export function useCreateNewMenuMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: iMenu }) =>
      ApiEndpoint<void>({
        method: 'POST',
        url: `${url}/api/system/menus`,
        data,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Menu'] });
    },
  });
}

export function useUpdateMenuPermissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ menuId, data }: { menuId: number; data: iMenu }) =>
      ApiEndpoint<void>({
        method: 'PUT',
        url: `${url}/api/system/menus/${menuId}`,
        data,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Menu'] });
    },
  });
}

export function useDeleteMenuByIdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ menuId }: { menuId: number }) =>
      ApiEndpoint<void>({
        method: 'DELETE',
        url: `${url}/api/system/menus/${menuId}`,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Menu'] });
    },
  });
}
