import { iAdmin } from '@/types/user/iAdmin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiEndpoint } from '../../ApiEndpoint';

const url = process.env.NEXT_PUBLIC_API_KEY;

export function useGetUserQuery() {
  const queryClient = useQueryClient();

  return useQuery({
    refetchOnWindowFocus: false,
    queryFn: () =>
      ApiEndpoint<iAdmin>(
        {
          method: 'GET',
          url: `${url}/api/admin/info`,
        },
        queryClient,
      ),
    queryKey: ['MyInfo'],
  });
}

export function useUpdateUserInfoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: iAdmin }) =>
      ApiEndpoint<{ message: string; user: iAdmin }>(
        {
          method: 'PUT',
          url: `${url}/api/admin/update/self`,
          data,
        },
        queryClient,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['User'] });
    },
  });
}

export function useDeleteMeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      ApiEndpoint<{ message: string; user: iAdmin }>(
        {
          method: 'PUT',
          url: `${url}/api/user/delete/me`,
        },
        queryClient,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['User'] });
    },
  });
}
export function useUpdateCustomerMutations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ body, userId }: { body: iAdmin; userId: string }) =>
      ApiEndpoint<{ user: iAdmin; message: string }>(
        {
          method: 'PUT',
          url: `${url}/api/user/update/customer/${userId}`,
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
export function useUpdateMyProfilePicMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ photo }: { photo: File }) =>
      ApiEndpoint<{ results: iAdmin; message: string }>(
        {
          method: 'PUT',
          url: `${url}/api/admin/self/update/picture`,
          data: { photo },
        },
        queryClient,
        'multipart/form-data',
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['MyInfo', 'User'] });
    },
  });
}
interface FormDataProps {
  passwordConfirm: string;
  passwordCurrent: string;
  password: string;
}

export function useChangePasswordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: FormDataProps }) =>
      ApiEndpoint<{ message: string; user: iAdmin }>(
        {
          method: 'PUT',
          url: `${url}/api/admin/self/update/change-password`,
          data: { ...data },
        },
        queryClient,
      ),
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: ['auth'] });
    },
  });
}
