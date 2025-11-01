import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UserService } from 'src/users/users.service';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { NotificationService } from 'src/notifications/notifications.service';
import { SubmitTaskDTO } from './dto/submit-task.dto';
import { Status } from 'src/common/enums/taskStatus.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  async createTask(
    createTaskDTO: CreateTaskDTO,
    userId: number,
  ): Promise<Task> {
    const { employeeId, ...taskAssign } = createTaskDTO;
    const employee = await this.userService.findById(employeeId);
    const task = this.taskRepo.create({
      ...taskAssign,
      employee,
    });
    const savedTask = await this.taskRepo.save(task);
    // for employee
    await this.notificationService.createUserNotification({
      userId: employeeId,
      message: `You have been assign for a new task: ${savedTask.title}`,
    });

    // for admin notif
    await this.notificationService.createUserNotification({
      userId: userId,
      message: `You been successfully assign ${employee.email} a new task`,
    });

    return savedTask;
  }

  async getAllOwnTask(userId: number): Promise<Task[]> {
    const task = await this.taskRepo.find({
      where: { employee: { id: userId } },
    });
    return task;
  }

  async getAllTaskByAdmin(): Promise<Task[]> {
    const task = await this.taskRepo.find({
      relations: ['employee'],
      select: { employee: { email: true } },
    });
    return task;
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id },
    });
    if (!task) throw new NotFoundException('Task not found!');
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

    const oldEmployee = taskExisted.employee;

    if (employeeId && employeeId !== oldEmployee.id) {
      // old to new emplooyee
      const newEmployee = await this.userService.findById(employeeId);
      taskExisted.employee = newEmployee;
      // notfi for new employee
      await this.notificationService.createUserNotification({
        userId: newEmployee.id,
        message: `This ${taskExisted.title} task from  ${oldEmployee.username} was transfer on you!`,
      });

      // notif for old employee
      await this.notificationService.createUserNotification({
        userId: oldEmployee.id,
        message: `Your task - ${taskExisted.title} was transfer to ${newEmployee.username} successfully!`,
      });
    }

    Object.assign(taskExisted, modifyTask);
    return await this.taskRepo.save(taskExisted);
  }

  async submitTask(
    taskId: number,
    submitTaskDTO: SubmitTaskDTO,
    userId: number,
    fileUrl?: string | null,
  ): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ['employee'],
    });
    if (!task) throw new NotFoundException('Task not found!');
    if (task.employee.id !== userId)
      throw new UnauthorizedException(`You can't modify this task!!!`);

    //  assign the answer base on dto on body
    task.answerText = submitTaskDTO.answerText;
    task.status = Status.Done;

    // check if the property that contain a file is has avalue
    if (fileUrl) task.fileUrl = fileUrl;

    // set notification after submitting
    await this.notificationService.createUserNotification({
      userId: userId,
      message: `Youre successfully submitted this task ${task.title}`,
    });

    return await this.taskRepo.save(task);
  }
}
