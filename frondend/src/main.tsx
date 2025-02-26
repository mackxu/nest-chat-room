import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { route } from './route';

const router = createBrowserRouter(route);

createRoot(document.getElementById('root')!).render(
  <App>
    <RouterProvider router={router} />
  </App>,
);
