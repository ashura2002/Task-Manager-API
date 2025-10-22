import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { UserRole } from 'src/common/enums/role.enum';
import { UserStatus } from 'src/common/enums/status.enum';

export class CreateUserDTO {
  @IsNotEmpty()
  userName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  status: UserStatus;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  age: number;

  @IsNotEmpty()
  Role: UserRole;
}
