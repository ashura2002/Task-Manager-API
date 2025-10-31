import { IsOptional, IsString } from 'class-validator';

export class SubmitTaskDTO {
  @IsOptional()
  @IsString()
  answerText?: string;
}
