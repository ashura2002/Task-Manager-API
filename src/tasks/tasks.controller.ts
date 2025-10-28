import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { TaskService } from './tasks.service';


@Controller('tasks')
@UseGuards(AuthGuard, RoleGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}


}
