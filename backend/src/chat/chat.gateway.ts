import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { from, map, Observable } from 'rxjs';

type ChatPayload = {
  sendUserId: number;
  chatroomId: number;
  message: {
    type: 'text' | 'image';
    content: string;
  };
};

type JoinRoomPayload = {
  chatroomId: number;
  userId: number;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayConnection {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  joinRoom(
    @MessageBody() payload: JoinRoomPayload,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('joinRoom', payload);
    const rid = String(payload.chatroomId);
    socket.join(rid);
    this.server.to(rid).emit('message', {
      type: 'text',
      content: `${payload.userId} join room`,
    });
    return payload.chatroomId;
  }

  @SubscribeMessage('chat')
  chat(@MessageBody() payload: ChatPayload) {
    // 回显聊天信息
    this.server.to(String(payload.chatroomId)).emit('message', {
      type: 'text',
      content: payload.message.content,
    });
  }

  @SubscribeMessage('async')
  asyncMsg(): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'hello', data: item })),
    );
  }

  handleConnection() {
    console.log('OnGatewayConnection');
  }

  handleDisconnect() {
    console.log('OnGatewayDisconnection');
  }
}
