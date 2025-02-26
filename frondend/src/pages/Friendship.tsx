import { Table, TableColumnsType } from 'antd';
import { useRequest } from 'ahooks';
import { getFriendList, User } from '../interfaces';

// 好友列表
export function Friendship() {
  const { data, error, loading } = useRequest(getFriendList);
  if (loading) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div>error</div>;
  }
  const columns: TableColumnsType<User> = [
    {
      title: '昵称',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      render: (_, record) => {
        return (
          <div>
            <a href="#">聊天</a>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <h1>好友列表</h1>
      <Table
        rowKey="id"
        dataSource={data}
        columns={columns}
        pagination={{ hideOnSinglePage: true }}
      />
    </div>
  );
}
