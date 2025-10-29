import { Module } from '@nestjs/common';
import { TaskController } from './tasks.controller';
import { TaskService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { UserModule } from 'src/users/users.module';
import { Notification_ } from 'src/notifications/entities/notifications.entity';
import { NotificationModule } from 'src/notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task,Notification_]), UserModule, NotificationModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports:[TaskService]
})
export class TasksModule {}
