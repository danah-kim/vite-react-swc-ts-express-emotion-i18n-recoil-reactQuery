import type { AxiosError, AxiosRequestConfig } from 'axios';
import Axios from 'axios';
import qs from 'qs';
import { toast } from 'react-toastify';

const axios = Axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL,
  withCredentials: true,
  paramsSerializer: {
    serialize: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
  },
});

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error: AxiosError<{ code: number; message: string }>) {
    if (error.response?.data != null) {
      toast.error(error.response.data.message);
    }

    return await Promise.reject(error);
  }
);

export const http = {
  getInstance: function getInstance() {
    return axios;
  },
  getAuthToken() {
    return String(axios.defaults.headers.common.Authorization ?? '').replace('Bearer ', '');
  },
  setAuthToken(token: string) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  clearAuthorization() {
    delete axios.defaults.headers.common.Authorization;
  },
  async get<Request = any, Response = unknown>(url: string, config?: AxiosRequestConfig<Request>) {
    return await axios.get<Response>(url, config).then((res) => res.data);
  },
  async post<Request = any, Response = unknown>(url: string, data?: Request, config?: AxiosRequestConfig<Request>) {
    return await axios.post<Response>(url, data, config).then((res) => res.data);
  },
  async put<Request = any, Response = unknown>(url: string, data?: Request, config?: AxiosRequestConfig<Request>) {
    return await axios.put<Response>(url, data, config).then((res) => res.data);
  },
  async patch<Request = any, Response = unknown>(url: string, data?: Request, config?: AxiosRequestConfig<Request>) {
    return await axios.patch<Response>(url, data, config).then((res) => res.data);
  },
  async delete<Response = unknown>(url: string, config?: AxiosRequestConfig) {
    return await axios.delete<Response>(url, config).then((res) => res.data);
  },
};
