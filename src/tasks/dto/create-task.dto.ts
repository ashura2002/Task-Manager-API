import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTaskDTO {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  description: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  employeeId: number;
}
