import { useRequest } from 'ahooks';
import { Chatroom, getChatroomList } from '../interfaces';
import { Button, Table, TableColumnsType } from 'antd';
import { useNavigate } from 'react-router';

export function Group() {
  const navigator = useNavigate();
  const { data, error, loading } = useRequest(() => getChatroomList('group'));
  if (loading) {
    return <div>loading...</div>;
  }
  if (error) {
    return <div>error</div>;
  }
  const columns: TableColumnsType<Chatroom> = [
    {
      title: '群名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      render: (_, room) => {
        return (
          <div>
            <Button
              type="link"
              onClick={() => {
                navigator('/chat', { state: { roomId: room.id } });
              }}
            >
              进入
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <Table rowKey="id" dataSource={data} columns={columns} pagination={false} />
  );
}
