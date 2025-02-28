import { App, Menu, MenuProps } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useEffect, useMemo } from 'react';
import { socket } from '../utils/socket';
import { Socket } from 'socket.io-client';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: '好友',
    key: 'friendship',
  },
  {
    label: '群聊',
    key: 'group',
  },
  {
    label: '聊天',
    key: 'chat',
  },
];

export function Layout() {
  const loc = useLocation();
  const currPath = useMemo(() => loc.pathname.substring(1), [loc.pathname]);
  const navigator = useNavigate();
  return (
    <div className="p-20">
      <div className="flex justify-between items-center h-10 bg-blue-400 p-4">
        <div>聊天室</div>
        <div>个人中心</div>
      </div>
      <div className="flex">
        <div className="w-30">
          <Menu
            items={items}
            selectedKeys={[currPath]}
            onClick={(item) => {
              navigator(item.key);
            }}
          />
        </div>
        <div className="flex-1">
          <Main isHome={loc.pathname === '/'} />
        </div>
      </div>
    </div>
  );
}

function Main({ isHome }: { isHome: boolean }) {
  const { message } = App.useApp();
  useEffect(() => {
    const onConnect = () => {
      console.log('connected');
      message.success('聊天服务器连接成功');
    };

    const onConnectError = (err: any) => {
      console.log('error', err);
    };

    const onDisconnect = (reason: Socket.DisconnectReason) => {
      console.log('disconnect', reason);
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectError);
    socket.on('disconnect', onDisconnect);
    socket.connect();
    return () => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onConnectError);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, [message]);
  if (isHome) {
    return <div>首页</div>;
  }
  return <Outlet />;
}
