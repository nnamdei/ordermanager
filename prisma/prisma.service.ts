import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  // Automatically connect to the database when the module is initialized
  async onModuleInit() {
    await this.$connect();
    // console.log('Prisma service connected to the database');
  }

  // Disconnect from the database when the module is destroyed
  async onModuleDestroy() {
    await this.$disconnect();
    // console.log('Prisma service disconnected from the database');
  }

  // Add custom transactional methods if needed
}
