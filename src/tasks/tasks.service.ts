import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}



}

// to do -> create a service layer for the task
