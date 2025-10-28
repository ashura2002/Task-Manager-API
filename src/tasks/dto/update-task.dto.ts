import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDTO } from './create-task.dto';
import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateTaskDTO extends PartialType(CreateTaskDTO) {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title?: string | undefined;

  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  description?: string | undefined;

  @IsInt()
  @IsNotEmpty()
  employeeId?: number | undefined;
}
