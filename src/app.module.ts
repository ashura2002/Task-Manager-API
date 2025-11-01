import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { NotificationModule } from './notifications/notifications.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000, // 1 minute
          limit: 10, // request per minutes
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get<string>('DB_TYPE') as any,
        host: config.get<string>('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') || '5432'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        synchronize: true, // false in production
        entities: [__dirname + '/./**/*.entity.{ts,js}'],
      }),
    }),
    UserModule,
    AuthModule,
    TasksModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // to apply it global
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
