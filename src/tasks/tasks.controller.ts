import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { TaskService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { Role } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('tasks')
@UseGuards(AuthGuard, RoleGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Role(UserRole.Admin)
  async createTask(
    @Req() req,
    @Body() createTaskDTO: CreateTaskDTO,
  ): Promise<Task> {
    const { userId } = req.user;
    return await this.taskService.createTask(userId, createTaskDTO);
  }

  @Get()
  async getAllTask(@Req() req): Promise<Task[]> {
    const { userId } = req.user;
    return await this.taskService.getAllUser(userId);
  }
}
