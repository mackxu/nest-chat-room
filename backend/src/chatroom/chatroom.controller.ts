import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UserInfo } from 'src/common/custom.decorator';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Get('create-one-to-one')
  @ApiOperation({ summary: '创建单聊' })
  async createOneToOne(@Query('friendId') friendId: number, @UserInfo('uid') userId: number) {
    return await this.chatroomService.createOneToOne(friendId, userId);
  }

  @Get('create-group')
  @ApiOperation({ summary: '创建群聊' })
  async createGroup(@UserInfo('uid') userId: number) {
    return await this.chatroomService.createGroup(userId);
  }

  @Get()
  @ApiOperation({ summary: '获取所有聊天室列表' })
  async getAllChatroom(@UserInfo('uid') userId: number, @Query('type') type?: string) {
    return await this.chatroomService.getAllChatroom(userId, type);
  }

  @Get('single')
  @ApiOperation({ summary: '获取单聊聊天室', description: '通过friendId获取单聊聊天室, 先查找, 没有则创建' })
  @ApiQuery({ name: 'friendId', type: 'number', required: true })
  async getSingleChatroom(@UserInfo('uid') userId: number, @Query('friend_id') friendId: number) {
    return await this.chatroomService.getSingleChatroom(userId, friendId);
  }

  @Get(':id')
  @ApiOperation({ summary: '通过id获取聊天室的信息' })
  async getChatroomInfo(@Param('id') id: string) {
    return await this.chatroomService.getChatroomInfo(+id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: '获取聊天室的成员信息' })
  async getChatroomMembers(@Param('id') id: string) {
    return await this.chatroomService.getChatroomMembers(+id);
  }

  @Post(':id/add_member/:join_uid')
  @ApiOperation({ summary: '申请通过，把好友加入群聊' })
  async joinGroup(@Param('id') gid: number, @Param('join_uid') joinUserId: number, @UserInfo('uid') userId: number) {
    return await this.chatroomService.joinGroup(gid, joinUserId, userId);
  }
}
