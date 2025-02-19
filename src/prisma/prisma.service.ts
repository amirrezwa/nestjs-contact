import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // constructor() {
  //   super({
  //     log: ['query', 'info', 'warn', 'error'], //  برای Debug
  //   });
  // }

  async onModuleInit() {
    await this.$connect(); // اتصال به پایگاه داده
    console.log('Connected to DB:', process.env.DATABASE_URL);
  }

  async onModuleDestroy() {
    await this.$disconnect(); // قطع اتصال هنگام بسته شدن ماژول
  }

  // تابعی برای اجرای یک تراکنش (اختیاری)
  async transaction(actions: any[]) {
    return this.$transaction(actions);
  }
}
