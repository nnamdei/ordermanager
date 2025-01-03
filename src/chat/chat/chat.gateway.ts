import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/chat', cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  // Handle user connections
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  // Handle user disconnections
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: { roomId: number; message: string }) {
    this.server.to(`room-${payload.roomId}`).emit('message', payload);
  }

  joinRoom(client: Socket, roomId: number) {
    client.join(`room-${roomId}`);
  }
}
