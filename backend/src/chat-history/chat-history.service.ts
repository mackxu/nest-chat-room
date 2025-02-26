import { Inject, Injectable } from '@nestjs/common';
import { ChatHistory } from '@prisma/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

type HistoryDto = Omit<ChatHistory, 'id' | 'createTime'>;

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

  async saveHistory(historyDto: HistoryDto) {
    await this.prisma.chatHistory.create({
      data: historyDto,
    });
  }
}
