import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ChatModule } from './chat/chat.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || '100%%%1234fgggfg***9', // Use env variables for production
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    UsersModule,
    OrdersModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, JwtService,ConfigService],
})
export class AppModule {}
