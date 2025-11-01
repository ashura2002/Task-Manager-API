import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.dto';
import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  username?: string | undefined;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  password?: string | undefined;
}
