import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/users.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    private readonly userRepo: UserService,
  ) {}

  async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    const { employeeId, ...taskAssign } = createTaskDTO;
    const employee = await this.userRepo.findById(employeeId);
    if (!employee) throw new NotFoundException('User not found');
    const task = this.taskRepo.create({
      ...taskAssign,
      employee,
    });
    return await this.taskRepo.save(task);
  }

  async getAllOwnTask(userId: number): Promise<Task[]> {
    const task = await this.taskRepo.find({
      where: { employee: { id: userId } },
      relations: ['employee'],
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        employee: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      },
    });
    return task;
  }
}
