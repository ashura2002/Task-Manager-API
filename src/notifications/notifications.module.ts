import { Module } from '@nestjs/common';
import { NotificationController } from './notifications.controller';
import { NotificationService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification_ } from './entities/notifications.entity';
import { User } from 'src/users/entities/user.entity';
import { UserModule } from 'src/users/users.module';


@Module({
  imports: [TypeOrmModule.forFeature([Notification_, User]), UserModule],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports:[NotificationService]
})
export class NotificationModule {}
