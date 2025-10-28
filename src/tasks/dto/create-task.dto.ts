import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTaskDTO {
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  title: string;

  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  description: string;
}
