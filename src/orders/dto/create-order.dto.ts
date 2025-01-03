import { IsNotEmpty, IsNumber, IsString, IsObject, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../orders.enum';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Brief description of the order',
    example: 'Order for custom-made furniture',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Detailed specifications for the order',
    example: 'Wooden table with a glass top, dimensions 120x60 cm',
  })
  @IsNotEmpty()
  @IsString()
  specifications: string;

  @ApiProperty({
    description: 'Quantity of items to be ordered',
    example: 10,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional({
    description: 'Additional metadata related to the order',
    example: { color: 'brown', deliveryDate: '2025-01-15' },
    type: Object,
  })
  @IsOptional()
  @IsObject()
  metadata: Record<string, any>;
}


export class UpdateOrderStatusDto {
    @ApiProperty({
      description: 'The new status of the order',
      enum: OrderStatus,
      example: OrderStatus.COMPLETED,
    })
    @IsNotEmpty()
    @IsEnum(OrderStatus, {
      message: 'Status must be a valid enum value: PENDING, IN_PROGRESS, or COMPLETED',
    })
    status: OrderStatus;
  }
