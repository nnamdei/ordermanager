import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @ApiOperation({ summary: 'create user' })
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('me')
  @ApiOperation({ summary: 'user profile' })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  async getUser( @Req() req: any) {
    const userId = req.user.sub;
    return this.usersService.findOne(userId);
  }
}
