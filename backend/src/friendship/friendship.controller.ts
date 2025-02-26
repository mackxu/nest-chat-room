import { Controller, Get, Post } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { UserInfo } from 'src/common/custom.decorator';
import { ApiOperation } from '@nestjs/swagger';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Get()
  @ApiOperation({ summary: '获取好友列表' })
  async getFriendsList(@UserInfo('uid') userId: number) {
    return await this.friendshipService.getUserFriends(userId);
  }

  @Post('remove/:friendId')
  async removeFriend(userId: number, friendId: number) {
    await this.friendshipService.removeFriend(userId, friendId);
    return '删除成功';
  }
}
