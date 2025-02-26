import { Button, Form, Input } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  type: 'text' | 'image';
  content: string;
}

export function Chat() {
  const [chatList, setChatList] = useState<Message[]>([]);
  const socketRef = useRef<Socket>(null);

  useEffect(() => {
    const socket = io('ws://localhost:3001');
    socketRef.current = socket;
    socket.on('connect', () => {
      console.log('connected');
      socket.emit('joinRoom', {
        chatroomId: 1,
        userId: 1,
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
  }, []);
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
        <button type="submit">发送</button>
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
