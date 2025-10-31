import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { TaskService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { Role } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UpdateTaskDTO } from './dto/update-task.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SubmitTaskDTO } from './dto/submit-task.dto';

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

  // to do -> add a logic for submitting answer for employee
  @Post(':id/submit')
  @Role(UserRole.Employee)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/tasks', // where the uploaded file store
        filename: (req, file, callback) => {
          const uniqueRandomChar =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extensionName = extname(file.originalname);
          callback(
            null,
            `${file.originalname}-${uniqueRandomChar}${extensionName}`,
          );
        },
      }),
    }),
  )
  async submitTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() submitTaskDTO: SubmitTaskDTO,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const { userId } = req.user;
    const fileUrl = file ? `/uploads/tasks/${file.originalname}` : null;
    return await this.taskService.submitTask(
      id,
      submitTaskDTO,
      userId,
      fileUrl,
    );
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

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return await this.taskService.getTaskById(id);
  }

  // -> admin only
  @HttpCode(HttpStatus.NO_CONTENT)
  @Role(UserRole.Admin)
  @Delete(':id')
  async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.taskService.deleteTask(id);
  }

  // -> admin only
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @Role(UserRole.Admin)
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTastDTO: UpdateTaskDTO,
  ): Promise<Task> {
    return await this.taskService.updateTask(id, updateTastDTO);
  }
}
