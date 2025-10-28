import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async createTask(
    userId: number,
    createTaskDTO: CreateTaskDTO,
  ): Promise<Task> {
    const task = this.taskRepo.create({
      ...createTaskDTO,
      employee: { id: userId },
    });
    return await this.taskRepo.save(task);
  }

  async getAllUser(userId: number): Promise<Task[]> {
    const task = await this.taskRepo.find({
      where: { employee: { id: userId } },
      relations: ['employee'],
    });
    return task;
  }
}
