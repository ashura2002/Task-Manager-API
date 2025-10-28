import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UserService } from 'src/users/users.service';
import { UpdateTaskDTO } from './dto/update-task.dto';

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

  async getAllTaskByAdmin(): Promise<Task[]> {
    const task = await this.taskRepo.find();
    return task;
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id },
    });
    if (!task) throw new NotFoundException('Task no found!');
    return task;
  }

  async deleteTask(id: number): Promise<void> {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');
    await this.taskRepo.remove(task);
  }

  async updateTask(id: number, updateTaskDTO: UpdateTaskDTO): Promise<Task> {
    const { employeeId, ...modifyTask } = updateTaskDTO;
    const taskExisted = await this.taskRepo.findOne({
      where: { id },
      relations: ['employee'],
    });
    if (!taskExisted) throw new NotFoundException('Task not existed!');

    if (employeeId) {
      const existedUser = await this.userRepo.findById(employeeId);
      taskExisted.employee = existedUser;
    }

    Object.assign(taskExisted, modifyTask);
    return await this.taskRepo.save(taskExisted);
  }
}
