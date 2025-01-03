import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMessageDto {
  @IsNotEmpty()
  content: string;

//   @IsUUID()
//   senderId: string;

  @IsUUID()
  chatRoomId: string;
}

export class CloseChatRoomDto {
  @IsNotEmpty()
  summary: string;

  @IsNotEmpty()
  orderId: string;
}
export class GetChatRoomsDto {
  @ApiPropertyOptional({
    description: 'Filter chat rooms by their closed status (true or false).',
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  isClosed?: boolean;
}
