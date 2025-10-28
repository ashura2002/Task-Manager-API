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

  // create -> Admin only
  @Post()
  @Role(UserRole.Admin)
  async createTask(@Body() createTaskDTO: CreateTaskDTO): Promise<Task> {
    return await this.taskService.createTask(createTaskDTO);
  }

  // get all own task -> employee only
  @Get()
  @Role(UserRole.Employee)
  async getAllOwnTask(@Req() req): Promise<Task[]> {
    const {userId} = req.user
    return await this.taskService.getAllOwnTask(userId);
  }
}
