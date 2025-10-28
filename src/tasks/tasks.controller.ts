import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Role(UserRole.Admin)
  async createTask(@Body() createTaskDTO: CreateTaskDTO): Promise<Task> {
    return await this.taskService.createTask(createTaskDTO);
  }

  // get all task - admin only
  @HttpCode(HttpStatus.OK)
  @Get('/admin')
  @Role(UserRole.Admin)
  async getAllTaskByAdmin(): Promise<Task[]> {
    return await this.taskService.getAllTaskByAdmin();
  }

  // get all own task -> employee only
  @HttpCode(HttpStatus.OK)
  @Get()
  @Role(UserRole.Employee)
  async getAllOwnTask(@Req() req): Promise<Task[]> {
    const { userId } = req.user;
    return await this.taskService.getAllOwnTask(userId);
  }

  // get by id -> admin only
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @Role(UserRole.Admin)
  async getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return await this.taskService.getTaskById(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.taskService.deleteTask(id);
  }

  // patch nalang 
  // then notification for user who got assign a task from admin
}
