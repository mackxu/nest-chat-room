import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { from, map, Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ChatHistoryService } from 'src/chat-history/chat-history.service';
import { UseGuards } from '@nestjs/common';
import { AuthWsGuard } from 'src/guard/auth-ws.guard';

type ChatPayload = {
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
@UseGuards(AuthWsGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly chatHistoryService: ChatHistoryService,
  ) {}

  @SubscribeMessage('join_room')
  joinRoom(@MessageBody() payload: JoinRoomPayload, @ConnectedSocket() socket: Socket) {
    console.log('joinRoom', payload, socket.data.user);
    const rid = String(payload.chatroomId);
    try {
      socket.join(rid);
      this.server.to(rid).emit('message', {
        type: 'text',
        content: `${socket.data.user?.uid} join room ${rid}`,
      });
    } catch (error) {
      console.log(error);
      return [null, 'join room failed'];
    }

    return [rid];
  }

  @SubscribeMessage('leave_room')
  leaveRoom(@MessageBody() payload: JoinRoomPayload, @ConnectedSocket() socket: Socket) {
    console.log('leaveRoom', payload, socket.data.user);
    const rid = String(payload.chatroomId);
    socket.leave(rid);
    return payload.chatroomId;
  }

  @SubscribeMessage('chat')
  async chat(@MessageBody() payload: ChatPayload, @ConnectedSocket() client: Socket) {
    // 保存聊天记录
    await this.chatHistoryService.saveHistory({
      chatroomId: payload.chatroomId,
      content: payload.message.content,
      type: payload.message.type === 'text' ? 0 : 1,
      senderId: client.data.user.uid,
    });
    // 向指定的聊天室发送消息
    this.server.to(String(payload.chatroomId)).emit('message', {
      type: 'text',
      content: payload.message.content,
    });
  }

  @SubscribeMessage('room_user_count')
  roomUserCount(@MessageBody() payload: JoinRoomPayload) {
    const rid = String(payload.chatroomId);
    const count = this.server.sockets.adapter.rooms.get(rid)?.size ?? 0;
    return {
      chatroomId: payload.chatroomId,
      count,
    };
  }

  @SubscribeMessage('async')
  asyncMsg(): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map((item) => ({ event: 'hello', data: item })));
  }

  afterInit() {
    console.log('OnGatewayInit');
  }

  handleConnection(client: Socket) {
    console.log('OnGatewayConnection');
    console.log(this.server.engine.clientsCount, 'clientsCount');
    try {
      const token = client.handshake?.auth?.token ?? client.handshake.headers?.token;
      if (!token) {
        throw new WsException('token is required');
      }
      const payload = this.jwtService.verify(token);
      client.data.user = payload;
    } catch (error) {
      console.log(error);
      client.disconnect();
    }
  }

  handleDisconnect() {
    console.log('OnGatewayDisconnection!');
  }
}
