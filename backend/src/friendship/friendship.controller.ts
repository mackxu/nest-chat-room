import { Controller, Get, Post } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { UserInfo } from 'src/common/custom.decorator';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Get('list')
  async getFriendsList(@UserInfo('uid') userId: number) {
    return await this.friendshipService.getUserFriends(userId);
  }

  @Post('remove/:friendId')
  async removeFriend(userId: number, friendId: number) {
    await this.friendshipService.removeFriend(userId, friendId);
    return '删除成功';
  }
}
