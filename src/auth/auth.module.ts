import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    JwtService,
    PrismaService,
    ConfigService,
  ],
})
export class AuthModule {}
