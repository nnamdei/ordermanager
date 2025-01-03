import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
  Put,
  HttpCode,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserGuard } from 'src/auth/guards/user.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth("JWT-auth")
@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrdersService) {}

  @Post("create")
  @ApiOperation({summary:"create order"})
  @HttpCode(201)
  @UseGuards(UserGuard)
  async createOrder(@Body() dto: CreateOrderDto, @Req() req: any) {
    const userId = req.user.sub;
    return this.orderService.createOrder(dto, userId);
  }

  @Get(':id')
  @ApiOperation({summary:"fetch single order"})
  @HttpCode(200)
  async getOrderById(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    const userId = req.user.sub;
    return this.orderService.getOrderById(id, userId);
  }

  @Put(':id/status')
  @UseGuards(AdminGuard)
  @ApiOperation({summary:"update order status by id"})
  @HttpCode(200)
  async updateOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return this.orderService.updateOrderStatus(id, dto, userId);
  }

  @Get()
  @ApiOperation({summary:"fetch all orders"})
  @HttpCode(200)
  async getOrdersForUser(@Req() req: any) {
    const userId = req.user.sub;
    return this.orderService.getOrdersForUser(userId);
  }
}
