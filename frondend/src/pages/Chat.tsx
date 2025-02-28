import { useRequest } from 'ahooks';
import { Button, Flex, Form, Input, Menu } from 'antd';
import { useEffect, useState } from 'react';
import { getChatroomList } from '../interfaces';
import { socket } from '../utils/socket';
import { useLocation } from 'react-router';
interface Message {
  type: 'text' | 'image';
  content: string;
}

export function Chat() {
  const loc = useLocation();
  const [roomId, setRoomId] = useState<number>(loc.state?.roomId);
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
      <Menu
        items={rooms}
        selectedKeys={[String(roomId)]}
        onSelect={({ key }) => {
          setRoomId(Number(key));
        }}
      />
      {roomId ? <ChatRoom chatroomId={roomId} /> : null}
    </Flex>
  );
}

function ChatRoom({ chatroomId }: { chatroomId: number }) {
  const [chatList, setChatList] = useState<Message[]>([]);

  useEffect(() => {
    if (!chatroomId) return;
    socket.emit('join_room', { chatroomId }, ([res, error]: any) => {
      if (error) {
        console.log('join room error', error);
        return;
      }
      console.log('join room', res);
    });

    return () => {
      socket.emit('leave_room', { chatroomId });
    };
  }, [chatroomId]);

  useEffect(() => {
    const onMessage = (data: any) => {
      console.log('message', data);
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
          socket.emit('chat', {
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
