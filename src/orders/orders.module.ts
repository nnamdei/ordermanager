import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ChatGateway } from 'src/chat/chat/chat.gateway';
import { ChatService } from 'src/chat/chat.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, ChatGateway, ChatService],
})
export class OrdersModule {}
