import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactModule } from './contact/contact.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [ContactModule, AuthModule, PrismaModule,

    ServeStaticModule.forRoot({
      rootPath: path.resolve('uploads'), // مسیر مستقیم
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply((req, res, next) => {
      console.log(`🔍 Request: ${req.method} ${req.url}`);
      next();
    }).forRoutes('*');
  }
}