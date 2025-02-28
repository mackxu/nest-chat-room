import { useRequest } from 'ahooks';
import { Button, Flex, Form, Input, Menu } from 'antd';
import { useEffect, useState } from 'react';
import { getChatroomList } from '../interfaces';
import { socket } from '../utils/socket';
import { Socket } from 'socket.io-client';
interface Message {
  type: 'text' | 'image';
  content: string;
}

export function Chat() {
  const { data, error, loading } = useRequest(getChatroomList);
  if (loading) {
    return <div>loading</div>;
  }
  if (error) {
    return <div>error</div>;
  }
  const rooms = data?.map((item) => {
    return {
      label: item.name,
      key: item.id,
    };
  });
  return (
    <Flex>
      <Menu items={rooms} onSelect={() => {}} />
      <ChatRoom chatroomId={1} />
    </Flex>
  );
}

function ChatRoom({ chatroomId }: { chatroomId: number }) {
  const [chatList, setChatList] = useState<Message[]>([]);

  useEffect(() => {
    const onConnect = () => {
      console.log('connected');
      socket.volatile.emit('join_room', {
        chatroomId: chatroomId,
      });
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
  }, [chatroomId]);

  useEffect(() => {
    const onMessage = (data: any) => {
      // console.log('message', data);
      setChatList((prev) => {
        return [...prev, data];
      });
    };
    socket.on('message', onMessage);

    return () => {
      socket.off('message', onMessage);
    };
  }, []);
  return (
    <div className="pl-5 pt-10">
      <Form
        style={{ maxWidth: 300 }}
        onFinish={(values) => {
          socket.volatile?.emit('chat', {
            chatroomId,
            message: {
              type: 'text',
              content: values.message,
            },
          });
        }}
      >
        <Form.Item name="message">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            发送
          </Button>
        </Form.Item>
      </Form>
      {chatList.map((item, idx) => {
        return (
          <div key={idx}>
            {item.type === 'text' ? (
              item.content
            ) : (
              <img src={item.content} alt="" />
            )}
          </div>
        );
      })}
    </div>
  );
}
