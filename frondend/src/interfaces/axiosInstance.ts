import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 内置响应模型
export type ResopnseModel<T> = {
  code: number;
  message: string;
  data: T;
};

const instance = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 5 * 60 * 1000,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (error.code === AxiosError.ERR_NETWORK) {
      return Promise.reject(new Error('网络错误'));
    }
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response: AxiosResponse<ResopnseModel<any>>): AxiosResponse['data'] => {
    return response.data;
  },
  (error) => {
    console.log('response --- ', error);
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // 401 未登录
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(new Error('未登录'));
      }
    }
    if (error.code === AxiosError.ERR_NETWORK) {
      return Promise.reject(new Error('网络错误,请检查网络连接'));
    }
    return Promise.reject(error);
  },
);

export function request<T, D = any>(config: AxiosRequestConfig<D>) {
  return new Promise<ResopnseModel<T>>((resolve, reject) => {
    return instance
      .request<any, ResopnseModel<T>>(config)
      .then((res) => {
        if (res.code !== 0) {
          reject(res);
          return;
        }
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export default instance;
