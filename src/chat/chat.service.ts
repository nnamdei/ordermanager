import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CloseChatRoomDto,
  CreateMessageDto,
  GetChatRoomsDto,
} from './dto/create-chat.dto';
import { PrismaService } from 'prisma/prisma.service';
import { OrderStatus } from 'src/orders/orders.enum';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(dto: CreateMessageDto, userId: string) {
    try {
      const findUser = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!findUser) {
        throw new ForbiddenException('Chat room does not exist');
      }

      // Find the chat room by its ID
      const chatRoom = await this.prisma.chatRoom.findUnique({
        where: { id: dto.chatRoomId },
      });

      // Check if the chat room exists and is not closed
      if (!chatRoom) {
        throw new ForbiddenException('Chat room does not exist');
      }

      if (chatRoom.isClosed) {
        throw new ForbiddenException('Chat room is closed');
      }

      // Create the message in the chat room
      const message = await this.prisma.message.create({
        data: {
          content: dto.content,
          senderId: userId,
          chatRoomId: dto.chatRoomId,
        },
      });

      // Return a success response
      return {
        status: 'success',
        message: 'Message sent successfully',
        data: message,
      };
    } catch (error) {
      // If it's a known error, return a structured response
      if (error instanceof ForbiddenException) {
        return {
          status: 'error',
          message: error.message,
          error: error.message,
        };
      }

      // For other unexpected errors, return a generic internal server error
      throw new InternalServerErrorException(
        'An error occurred while sending the message',
      );
    }
  }

  async closeChatRoom(
    chatRoomId: string,
    dto: CloseChatRoomDto,
    userId: string,
  ) {
    try {
      const findUser = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!findUser || findUser.role !== 'admin') {
        throw new ForbiddenException(
          'User not found or cannot perform this action',
        );
      }
      // Attempt to update the chat room status to closed
      const chatRoom = await this.prisma.chatRoom.update({
        where: { id: chatRoomId },
        data: {
          isClosed: true,
          summary: dto.summary,
        },
      });

      await this.prisma.order.update({
        where: { id: dto.orderId, status: OrderStatus.REVIEW },
        data: { status: OrderStatus.PROCESSING },
      });

      // If no chat room was found, throw a not found exception
      if (!chatRoom) {
        throw new NotFoundException(
          `Chat room with ID ${chatRoomId} not found`,
        );
      }

      // Return a success response with the closed chat room data
      return {
        status: 'success',
        message: 'Chat room closed successfully',
        data: chatRoom,
      };
    } catch (error) {
      // Log the error for debugging
      console.error(error);

      // Handle specific error cases and throw appropriate exceptions
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Handle unexpected errors and return a generic server error
      throw new InternalServerErrorException(
        'An error occurred while closing the chat room',
      );
    }
  }

  // Method to fetch messages from a chat room
  async getMessages(chatRoomId: string, userId: string) {
    try {
      // Fetch messages sorted by creation date
      const messages = await this.prisma.message.findMany({
        where: { chatRoomId, sender: { id: userId } },
        orderBy: { createdAt: 'asc' },
      });

      // If no messages are found, return an empty array with a status message
      if (!messages || messages.length === 0) {
        return {
          status: 'success',
          message: 'No messages found for this user or chat room',
          data: [],
        };
      }

      // Return the fetched messages
      return {
        status: 'success',
        message: 'Messages fetched successfully',
        data: messages,
      };
    } catch (error) {
      // Log the error for debugging
      console.error(error);

      // Throw a server error if any issue occurs while fetching messages
      throw new InternalServerErrorException(
        'An error occurred while fetching messages',
      );
    }
  }

  async getChatRooms(query: GetChatRoomsDto) {
    try {
      const { isClosed } = query;

      // Transform `isClosed` to a boolean if it exists
      const isClosedBoolean =
        typeof isClosed === 'string' ? isClosed === 'true' : isClosed;

      const chatRooms = await this.prisma.chatRoom.findMany({
        where: {
          ...(isClosed !== undefined && { isClosed: isClosedBoolean }),
        },
        select: {
          messages: {
            select: {
              sender: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
        },
        // orderBy: { createdAt: 'asc' },
      });

      if (!chatRooms || chatRooms.length === 0) {
        return {
          status: 'success',
          message: 'No chat rooms found',
          data: [],
        };
      }

      return {
        status: 'success',
        message: 'Chat rooms fetched successfully',
        data: chatRooms,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'An error occurred while fetching chat rooms',
      );
    }
  }
}
