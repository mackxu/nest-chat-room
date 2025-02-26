import { useRequest } from 'ahooks';
import { Button, Flex, Form, Input, Menu } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getChatroomList } from '../interfaces';
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
      <ChatMain senderId={2} chatroomId={1} />
    </Flex>
  );
}

function ChatMain({
  senderId,
  chatroomId,
}: {
  senderId: number;
  chatroomId: number;
}) {
  const [chatList, setChatList] = useState<Message[]>([]);
  const socketRef = useRef<Socket>(null);

  useEffect(() => {
    const socket = io('ws://localhost:3001', {
      auth: {
        token: localStorage.getItem('token'),
      },
    });
    socketRef.current = socket;
    socket.on('connect', () => {
      console.log('connected');
      socket.emit('joinRoom', {
        chatroomId: chatroomId,
        userId: senderId,
      });
      socket.on('message', (data) => {
        console.log('message', data);
        setChatList((prev) => {
          return [...prev, data];
        });
      });
    });

    socket.on('disconnect', () => {
      console.log('disconnect');
    });

    return () => {
      socket.disconnect();
    };
  }, [chatroomId, senderId]);
  return (
    <div className="pl-5 pt-10">
      <Form
        style={{ maxWidth: 300 }}
        onFinish={(values) => {
          socketRef.current?.emit('chat', {
            chatroomId: 1,
            userId: 1,
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
