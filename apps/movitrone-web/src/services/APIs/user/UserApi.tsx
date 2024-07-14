import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiEndpoint } from '../../ApiEndpoint';
import { iUser } from '@/types/user/iUser';
import { useTableParamsStore } from '@/store/useTableParamsStore';

const url = process.env.NEXT_PUBLIC_API_KEY;

export function useGetAllUsersQuery() {
  const queryClient = useQueryClient();
  const { pagination } = useTableParamsStore();

  return useQuery({
    refetchOnWindowFocus: false,
    queryFn: () =>
      ApiEndpoint<{ users: iUser[]; totalCount: number; results: number }>(
        {
          method: 'GET',
          url: `${url}/api/user/all-users?page=${pagination.page}&limit=${pagination.limit}`,
        },
        queryClient,
      ),
    queryKey: ['User', pagination],
  });
}
export function useGetUserByIdQuery({ userId }: { userId: number }) {
  const queryClient = useQueryClient();

  return useQuery({
    refetchOnWindowFocus: false,
    queryFn: () =>
      ApiEndpoint<iUser>(
        {
          method: 'GET',
          url: `${url}/api/user/get-by-id/${userId}`,
        },
        queryClient,
      ),
    queryKey: ['User', userId],
  });
}

export function useCreateNewUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: iUser }) =>
      ApiEndpoint<void>(
        {
          method: 'POST',
          url: `${url}/api/user/create-user/`,
          data,
        },
        queryClient,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['User'] });
    },
  });
}

export function useUpdateUserByIdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, userId }: { data: iUser; userId: number }) =>
      ApiEndpoint<void>(
        {
          method: 'PUT',
          url: `${url}/api/user/update-by-id/${userId}`,
          data,
        },
        queryClient,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['User'] });
    },
  });
}

export function useDeleteUserByIdMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: number }) =>
      ApiEndpoint<void>(
        {
          method: 'DELETE',
          url: `${url}/api/user/delete-by-id/${userId}`,
        },
        queryClient,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['User'] });
    },
  });
}
export function useUpdateUserPasswordByIdMutations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ body, userId }: { body: iUser; userId: string }) =>
      ApiEndpoint<void>(
        {
          method: 'PUT',
          url: `${url}/api/user/update-by-id/${userId}/passwword`,
          data: body,
        },
        queryClient,
      ),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ['User'],
      });
    },
  });
}
