import { Inject, Injectable } from '@nestjs/common';
import { ChatHistory } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

type HistoryDto = Omit<ChatHistory, 'id'>;

@Injectable()
export class ChatHistoryService {
  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  async historyListOfChatroom(chatroomId: number) {
    return await this.prisma.chatHistory.findMany({
      where: {
        chatroomId,
      },
      select: {
        id: true,
        senderId: true,
        content: true,
        createTime: true,
      },
      orderBy: {
        createTime: 'desc',
      },
    });
  }

  async saveHistory(senderId: number, historyDto: HistoryDto) {
    await this.prisma.chatHistory.create({
      data: {
        senderId,
        ...historyDto,
      },
    });
  }
}
