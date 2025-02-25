import { request } from './axiosInstance';

type LoginRes = {
  token: string;
  user: any;
};
export async function login(username: string, password: string) {
  const res = await request<LoginRes>({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password,
    },
  });
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('user', JSON.stringify(res.data.user));
  return res.data.user;
}
