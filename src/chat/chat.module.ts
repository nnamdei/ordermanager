import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat/chat.gateway';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway,PrismaService],
  exports: [ChatGateway]
})
export class ChatModule {}
