import { iAdmin } from '@/types/user/iAdmin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiEndpoint } from '../../ApiEndpoint';

const url = process.env.NEXT_PUBLIC_API_KEY;

export function useGetAdminsByRoleQuery({
  role,
  page,
  limit,
}: {
  page: number;
  limit: number;
  role: 'Manager' | 'Super Admin' | 'Employee' | 'Customer' | 'Raya';
}) {
  const queryClient = useQueryClient();
  return useQuery({
    queryFn: () =>
      ApiEndpoint<{ users: iAdmin[]; totalCount: number; status: number }>(
        {
          method: 'GET',
          url: `${url}/api/admin/users?role=${role}&page=${page}&limit=${limit}`,
        },
        queryClient,
      ),
    queryKey: ['Admin', role, page, limit],
  });
}

export function useGetAdminUserByIdQuery(userId: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryFn: () =>
      ApiEndpoint<{ user: iAdmin }>(
        {
          method: 'GET',
          url: `${url}/api/admin/user/${userId}`,
        },
        queryClient,
      ),
    queryKey: ['Admin', userId],
  });
}

export function useSearchAdminQuery(keyword: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryFn: () =>
      ApiEndpoint<{ users: iAdmin[] }>(
        {
          method: 'GET',
          url: `${url}/api/admin/search?search=${keyword}`,
        },
        queryClient,
      ),
    queryKey: ['Admin', keyword],
    enabled: !!keyword,
  });
}

export function useNewUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: iAdmin }) =>
      ApiEndpoint<{ results: iAdmin }>(
        {
          method: 'POST',
          url: `${url}/api/admin/user/new`,
          data,
        },
        queryClient,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Admin'] });
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ body, userId }: { body: iAdmin; userId: string }) =>
      ApiEndpoint<{ results: iAdmin; message: string }>(
        {
          method: 'PUT',
          url: `${url}/api/admin/update/profile/${userId}`,
          data: body,
        },
        queryClient,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Admin'] });
    },
  });
}
interface FormDataProps {
  passwordConfirm: string;
  passwordCurrent: string;
  password: string;
}
export function useChangeUserPasswordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, userId }: { data: FormDataProps; userId: string }) =>
      ApiEndpoint<{ message: string; user: iAdmin }>(
        {
          method: 'PUT',
          url: `${url}/api/admin/update/change-password/${userId}`,
          data: { ...data },
        },
        queryClient,
      ),
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: ['auth'] });
    },
  });
}

export function useUpdateUserProfilePicMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ photo, userId }: { photo: File; userId: string }) =>
      ApiEndpoint<{ results: iAdmin; message: string }>(
        {
          method: 'PUT',
          url: `${url}/api/admin/update/pic/${userId}`,
          data: { photo },
        },
        queryClient,
        'multipart/form-data',
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Admin'] });
    },
  });
}
export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      ApiEndpoint<{ message: string; user: iAdmin }>(
        {
          method: 'DELETE',
          url: `${url}/api/admin/delete/${userId}`,
        },
        queryClient,
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['Admin'] });
    },
  });
}
