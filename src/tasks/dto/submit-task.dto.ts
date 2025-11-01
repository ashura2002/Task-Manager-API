import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SubmitTaskDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  answerText?: string;

  @ApiProperty()
  @IsOptional()
  file?: string;
}
