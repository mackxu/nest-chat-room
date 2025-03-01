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

export type User = {
  id: number;
  username: string;
  email: string;
};
export async function getFriendList() {
  const res = await request<User[]>({
    url: '/friendship',
    method: 'get',
  });
  return res.data;
}

export type Chatroom = {
  id: number;
  name: string;
  type: boolean;
  createTime: string;
  updateTime: string;
};

export type ChatroomType = 'single' | 'group';

export async function getChatroomList(type?: ChatroomType) {
  let url = '/chatroom';
  if (type) {
    url += '?type=' + type;
  }
  const res = await request<Chatroom[]>({
    url,
    method: 'get',
  });
  return res.data;
}

export async function getSingleChatroom(friendId: number) {
  const res = await request<Chatroom>({
    url: `/chatroom/single?friend_id=${friendId}`,
    method: 'get',
  });
  return res.data;
}
