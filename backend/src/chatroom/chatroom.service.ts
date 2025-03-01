import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatroomService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  @Inject(UserService)
  private readonly userService: UserService;

  async createOneToOne(friendId: number, userId: number) {
    const friend = await this.userService.findOne(friendId);
    if (!friend) {
      throw new BadRequestException('好友不存在');
    }

    // 创建聊天室
    const room = await this.prisma.chatroom.create({
      data: {
        name: friend.nickName || friend.username,
      },
      select: {
        id: true,
      },
    });
    // 创建聊天室成员
    await this.prisma.chatroomUser.createMany({
      data: [
        {
          userId,
          chatroomId: room.id,
        },
        {
          userId: friendId,
          chatroomId: room.id,
        },
      ],
    });
    return room;
  }
  async createGroup(userId: number) {
    const room = await this.prisma.chatroom.create({
      data: {
        name: `群_${Math.random().toString(36).substring(2, 8)}`,
        type: true,
      },
      select: {
        id: true,
      },
    });
    await this.prisma.chatroomUser.create({
      data: {
        userId,
        chatroomId: room.id,
      },
    });
    return room;
  }
  async getAllChatroom(userId: number, type?: string) {
    let roomType: boolean | undefined;
    if (typeof type === 'string') {
      roomType = type === 'group';
    }
    const chatroomList = await this.prisma.chatroom.findMany({
      where: {
        type: roomType,
        users: {
          some: {
            userId,
          },
        },
      },
      include: {
        users: true,
      },
    });
    return chatroomList;
  }
  async getChatroomInfo(id: number) {
    return await this.prisma.chatroom.findUnique({
      where: {
        id,
      },
    });
  }
  async getChatroomMembers(rid: number) {
    const users = await this.prisma.chatroomUser.findMany({
      where: {
        chatroomId: rid,
      },
    });
    const userIds = users.map((item) => item.userId);
    return await this.userService.findList(userIds);
  }
  async joinGroup(gid: number, joinUserId: number, userId: number) {
    const room = await this.prisma.chatroom.findFirst({
      where: {
        id: gid,
        type: true,
        users: {
          some: {
            userId,
          },
        },
      },
    });
    if (!room) {
      throw new BadRequestException('您的群聊不存在，添加失败');
    }
    return await this.prisma.chatroomUser.create({
      data: {
        userId: joinUserId,
        chatroomId: gid,
      },
    });
  }
  async getSingleChatroom(userId: number, friendId: number) {
    // 当前用户所有单聊的聊天室
    const rooms = await this.prisma.chatroom.findMany({
      where: {
        type: false,
        users: {
          some: {
            userId,
          },
        },
      },
    });
    // 查找有成员的friendId的聊天室
    const room = await this.prisma.chatroom.findFirst({
      where: {
        id: {
          in: rooms.map((item) => item.id),
        },
        users: {
          some: {
            userId: friendId,
          },
        },
      },
    });
    // 如果没有则创建
    if (!room) {
      return await this.createOneToOne(friendId, userId);
    }
    return room;
  }
}
