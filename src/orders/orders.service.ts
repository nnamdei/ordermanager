import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'prisma/prisma.service';
import { OrderStatus } from './orders.enum';
import { ChatGateway } from 'src/chat/chat/chat.gateway';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService, private readonly chatGateway: ChatGateway) {}

  async createOrder(dto: CreateOrderDto, userId: string) {
    try {
      // Check if user has more than two orders with status "review"
      const ordersInReview = await this.prisma.order.count({
        where: {
          userId: userId,
          status: OrderStatus.REVIEW,
        },
      });

      if (ordersInReview >= 5) {
        throw new ForbiddenException(
          'You cannot create a new order while you have more than two orders in review.',
        );
      }

      const newOrder = await this.prisma.order.create({
        data: {
          ...dto,
          userId: userId,
        },
      });
      const newChatRoom = await this.prisma.chatRoom.create({
        data: {
          orderId: newOrder.id,
        },
      });
      // this.chatGateway.joinRoomHandler(newChatRoom.id, userId);
      return {
        status: 'success',
        message: 'Order successfully created.',
        data: { id: newOrder.id },
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        error: error.message || 'An error occurred',
      };
    }
  }

  async getOrderById(id: string, userId: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: id, user: { id: userId } },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          chatRoom:true
        },
      });

      // If order does not exist
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      return {
        status: 'success',
        message: 'Order fetched successfully',
        data: order,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'An error occurred while fetching the order',
        error: error.message || 'Internal server error',
      };
    }
  }

  // Update the order status, ensuring the user is authorized
  async updateOrderStatus(
    id: string,
    dto: UpdateOrderStatusDto,
    userId: string,
  ) {
    try {
      // First, find the order and check if it exists
      const order = await this.prisma.order.findUnique({
        where: { id: id, user: { id: userId } },
        include: {
          user: true, // Include user to compare userId
        },
      });

      // If the order is not found
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      // Proceed with updating the order status
      const updatedOrder = await this.prisma.order.update({
        where: { id },
        data: { status: dto.status },
      });

      return {
        status: 'success',
        message: 'Order status updated successfully',
        data: updatedOrder,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'An error occurred while updating the order status',
        error: error.message || 'Internal server error',
      };
    }
  }

  async getOrdersForUser(userId: string) {
    try {
      // Fetch orders that belong to the user
      const orders = await this.prisma.order.findMany({
        where: {
          userId: userId,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          chatRoom:true
        },
      });

      // If no orders are found, throw a NotFoundException
      if (!orders || orders.length === 0) {
        throw new NotFoundException(
          `No orders found for user with ID ${userId}`,
        );
      }

      return {
        status: 'success',
        message: 'Orders fetched successfully',
        data: orders,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'An error occurred while fetching orders',
        error: error.message || 'An error occurred',
      };
    }
  }
}
