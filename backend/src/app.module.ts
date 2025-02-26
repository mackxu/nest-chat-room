import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './common/prisma/prisma.module';
import { RedisModule } from './common/redis/redis.module';
import { EmailModule } from './common/email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { FriendshipModule } from './friendship/friendship.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';
import { ChatroomModule } from './chatroom/chatroom.module';
import { ChatModule } from './chat/chat.module';
import { ChatHistoryModule } from './chat-history/chat-history.module';

@Module({
  imports: [
    LoggerModule.forRoot(),
    PrismaModule,
    RedisModule,
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '30m' },
      }),
      inject: [ConfigService],
    }),
    FriendshipModule,
    ChatroomModule,
    ChatModule,
    ChatHistoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
