import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [AuthModule, UsersModule, OrdersModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
