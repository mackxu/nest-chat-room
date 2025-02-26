import { Controller, Get, Param } from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('chat-history')
export class ChatHistoryController {
  constructor(private readonly chatHistoryService: ChatHistoryService) {}

  @Get('chatroom/:id')
  @ApiOperation({ summary: '获取聊天室的聊天记录' })
  async historyListOfChatroom(@Param('id') chatroomId: number) {
    return await this.chatHistoryService.historyListOfChatroom(chatroomId);
  }
}
