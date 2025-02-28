import { Menu, MenuProps } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router';

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
            defaultSelectedKeys={[loc.pathname.substring(1)]}
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
  if (isHome) {
    return <div>首页</div>;
  }
  return <Outlet />;
}
