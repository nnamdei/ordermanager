import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { GetChatRoomsDto } from './dto/create-chat.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  @ApiQuery({
    name: 'isClosed',
    required: false,
    description: 'Filter chat rooms by their closed status (true or false).',
    // type: Boolean,
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Fetch all created chat rooms' })
  async getChatRooms(@Query() query: GetChatRoomsDto) {
    return this.chatService.getChatRooms(query);
  }
}
