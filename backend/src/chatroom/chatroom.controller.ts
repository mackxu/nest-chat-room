import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ApiOperation } from '@nestjs/swagger';
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
  @Get(':id')
  @ApiOperation({ summary: '获取聊天室的信息' })
  async getChatroomInfo(@Param('id') id: string) {
    return await this.chatroomService.getChatroomInfo(+id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: '获取聊天室的成员信息' })
  async getChatroomMembers(@Param('id') id: string) {
    return await this.chatroomService.getChatroomMembers(+id);
  }

  @Get(':id/add')
  @ApiOperation({ summary: '申请通过，把好友加入群聊' })
  async joinGroup(@Param('id') gid: number, @Query('join_uid') joinUserId: number) {
    return await this.chatroomService.joinGroup(gid, joinUserId);
  }
}
