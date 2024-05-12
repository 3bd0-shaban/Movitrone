import { useAuthStore } from '@/store/useAuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiEndpoint } from '../ApiEndpoint';
import axios, { AxiosRequestConfig } from 'axios';
import { AuthState } from '@/types/user/iAdmin';

const url = process.env.NEXT_PUBLIC_API_KEY;

export function useSignInMutation() {
  const queryClient = useQueryClient();
  const setUserCredentials = useAuthStore((state) => state.setCredentials);
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      ApiEndpoint<AuthState>(
        {
          method: 'post',
          url: `${url}/api/auth-admin/signin`,
          data: { email, password },
        },
        queryClient,
      ),
    onSuccess: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['auth'] });
      const { user, access_token } = data;
      setUserCredentials(user, access_token);
    },
  });
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const headers: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
      },
      withCredentials: true,
    };

    const response = await axios.post<AuthState>(
      `${url}/api/auth-admin/signin`,
      { email, password },
      headers,
    );

    return response.data;
  } catch (error) {
    // Handle errors here
    throw error;
  }
}
export function useLogOutMutation() {
  const queryClient = useQueryClient();
  const logOut = useAuthStore((state) => state.LogOut);

  return useMutation({
    mutationFn: () =>
      ApiEndpoint<{ message: string; status: number }>(
        { method: 'post', url: `${url}/api/auth-admin/logout` },

        queryClient,
      ),
    onSuccess: () => {
      logOut();
      setTimeout(() => {
        queryClient.resetQueries({ queryKey: ['auth'] });
      }, 1000);
    },
  });
}
