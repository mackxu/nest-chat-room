import { RouteObject } from 'react-router';
import { Login } from './pages/Login';
import { Layout } from './layout/Layout';
import { Friendship } from './pages/Friendship';
import { Group } from './pages/Group';
import { Chat } from './pages/Chat';

// 定义路由
export const route: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/friendship',
        element: <Friendship />,
      },
      {
        path: '/group',
        element: <Group />,
      },
      {
        path: '/chat',
        element: <Chat />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
];
