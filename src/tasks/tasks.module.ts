import { Module } from '@nestjs/common';
import { TaskController } from './tasks.controller';
import { TaskService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TasksModule {}
