import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from 'antd';
import { Login } from './pages/Login';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router';
import { Index } from './pages/Index';

// 定义路由
const route: RouteObject[] = [
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/login',
    element: <Login />,
  },
];

const router = createBrowserRouter(route);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </StrictMode>,
);
