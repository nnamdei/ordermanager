import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChatService } from '../chat.service';
import { CloseChatRoomDto, CreateMessageDto } from '../dto/create-chat.dto';
import { Server } from 'ws';

@WebSocketGateway(3001)
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() data: CreateMessageDto & { userId: string },
  ) {
    try {
      const response = await this.chatService.sendMessage(data, data.userId);
      this.server.clients.forEach((client) => {
        client.send(JSON.stringify(response));
      });
      return response;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error while sending the message',
      );
    }
  }

  @SubscribeMessage('closeChatRoom')
  async closeChatRoom(
    @MessageBody()
    data: { chatRoomId: string; userId: string; closeChatRoomDto: CloseChatRoomDto },
  ) {
    try {
      const response = await this.chatService.closeChatRoom(
        data.chatRoomId,
        data.closeChatRoomDto,
        data.userId,
      );
      this.server.clients.forEach((client) => {
        client.send(JSON.stringify(response));
      });
      return response;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error while closing the chat room',
      );
    }
  }

  @SubscribeMessage('getMessages')
  async getMessages(
    @MessageBody() data: { chatRoomId: string; userId: string },
  ) {
    try {
      const response = await this.chatService.getMessages(
        data.chatRoomId,
        data.userId,
      );
      return response;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error while fetching messages',
      );
    }
  }
}


