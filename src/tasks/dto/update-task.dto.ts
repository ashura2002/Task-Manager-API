import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDTO } from './create-task.dto';
import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDTO extends PartialType(CreateTaskDTO) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title?: string | undefined;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  description?: string | undefined;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  employeeId?: number | undefined;
}
