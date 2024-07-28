import axios, { AxiosRequestConfig } from 'axios';
import { refreshToken, RefreshTokenProps } from './refreshToken';
import { getCookie, setCookie } from 'cookies-next';

export async function ApiEndpoint<T>(
  config: AxiosRequestConfig = {},
  formdata?: 'application/pdf' | 'multipart/form-data' | 'application/json',
): Promise<T> {
  try {
    const access_token = getCookie('access_token');

    config.headers = config.headers || {};

    if (formdata) {
      // Set Content-Type to multipart/form-data for media requests
      config.headers['Content-Type'] = formdata;
      if (formdata === 'application/pdf') {
        config.responseType = 'blob';
      }
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    config.withCredentials = true;

    config.headers['Access-Control-Allow-Credentials'] = 'true';
    config.headers['Authorization'] = `Bearer ${access_token}`;

    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    if (
      (error.response && error.response.status === 403) ||
      error.response.status === 401
    ) {
      // Token is expired or invalid, try to refresh it
      try {
        const { access_token, expires_at } = await refreshToken();

        setCookie('access_token', access_token);

        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${access_token}`;
        config.headers['Content-Type'] = 'application/json';
        config.headers['Access-Control-Allow-Credentials'] = 'true';

        // Include credentials in the request
        config.withCredentials = true;

        const response = await axios(config);
        return response.data;
      } catch (refreshError) {
        throw refreshError;
      }
    }
    throw error;
  }
}
