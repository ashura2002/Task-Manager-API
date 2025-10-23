import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllUser(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async registerUser(@Body() createUserDTO: CreateUserDTO): Promise<User> {
    return await this.userService.create(createUserDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id/details')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.userService.findById(id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id/details')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDTO: UpdateUserDTO,
  ): Promise<User> {
    return await this.userService.update(id, updateUserDTO);
  }
}
