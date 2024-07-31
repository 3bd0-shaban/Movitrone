import axios, { AxiosRequestConfig } from 'axios';

const url = process.env.NEXT_PUBLIC_API_KEY;

export interface RefreshTokenProps {
  access_token: string;
  expires_at: Date;
}

export async function refreshToken(): Promise<RefreshTokenProps> {
  try {
    const headers: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
      },
      withCredentials: true,
    };

    const response = await axios.get<RefreshTokenProps>(
      `${url}/api/auth-admin/refreshToken`,
      headers,
    );

    return response.data;
  } catch (error) {
    // Handle token refresh errors here
    throw error;
  }
}
