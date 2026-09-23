import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  withCredentials: true,
});

let token: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const setAccessToken = (value: string | null) => {
  token = value;
};
export const getAccessToken = () => token;

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = client
      .post('/api/v1/auth/refresh', undefined, { headers: { Authorization: undefined } })
      .then((response) => {
        const next = response.data.accessToken as string;
        setAccessToken(next);
        return next;
      })
      .catch(() => {
        setAccessToken(null);
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;
    const isAuthRequest = request?.url?.startsWith('/api/v1/auth/');
    if (error.response?.status === 401 && request && !request._retried && !isAuthRequest) {
      request._retried = true;
      const next = await refreshAccessToken();
      if (next) return client(request);
    }
    return Promise.reject(error);
  },
);

export const apiError = (error: unknown) => {
  if (axios.isAxiosError(error)) return error.response?.data?.message || error.message;
  return 'Something went wrong. Please try again.';
};

export default client;
