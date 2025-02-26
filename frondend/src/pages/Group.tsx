import { useRequest } from 'ahooks';
import { Chatroom, getChatroomList } from '../interfaces';
import { Table, TableColumnsType } from 'antd';

export function Group() {
  const { data, error, loading } = useRequest(getChatroomList);
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
    <Table rowKey="id" dataSource={data} columns={columns} pagination={false} />
  );
}
