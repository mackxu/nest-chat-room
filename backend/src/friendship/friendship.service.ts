import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class FriendshipService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  async getUserFriends(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        friends: true,
      },
    });
    if (user) {
      // 返回好友列表
      return await this.prisma.user.findMany({
        where: {
          id: {
            in: user.friends.map((friend) => friend.friendId),
          },
        },
        select: {
          id: true,
          username: true,
          email: true,
        },
      });
    }
    return [];
  }

  async removeFriend(friendId: number, userId: number) {
    await this.prisma.friendship.deleteMany({
      where: {
        OR: [
          {
            userId: userId,
            friendId: friendId,
          },
          {
            userId: friendId,
            friendId: userId,
          },
        ],
      },
    });
    return true;
  }
  async addFriend(userId: number, friendId: number) {
    return await this.prisma.friendship.create({
      data: {
        userId,
        friendId,
      },
    });
  }
}
