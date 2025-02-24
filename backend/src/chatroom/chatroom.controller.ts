import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ApiOperation } from '@nestjs/swagger';
import { UserInfo } from 'src/common/custom.decorator';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}

  @Get('create-one-to-one')
  @ApiOperation({ summary: '创建单聊' })
  async createOneToOne(
    @Query('friendId') friendId: string,
    @UserInfo('uid') userId: number,
  ) {
    return await this.chatroomService.createOneToOne(+friendId, userId);
  }

  @Get('create-group')
  @ApiOperation({ summary: '创建群聊' })
  async createGroup(@UserInfo('uid') userId: number) {
    return await this.chatroomService.createGroup(userId);
  }

  @Get()
  @ApiOperation({ summary: '获取所有聊天室列表' })
  async getAllChatroom(@UserInfo('uid') userId: number) {
    return await this.chatroomService.getAllChatroom(userId);
  }
  @Get(':id')
  @ApiOperation({ summary: '获取聊天室的信息' })
  async getChatroomInfo(@Param('id') id: string) {
    return await this.chatroomService.getChatroomInfo(+id);
  }

  @Get(':id/members')
  @ApiOperation({ summary: '获取聊天室的成员' })
  async getChatroomMembers(@Param('id') id: string) {
    return await this.chatroomService.getChatroomMembers(+id);
  }
}
