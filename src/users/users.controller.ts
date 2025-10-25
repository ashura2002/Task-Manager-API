import {
  Body,
  Controller,
  Delete,
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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllUser(): Promise<User[]> {
    return await this.userService.findAll();
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

  @HttpCode(HttpStatus.NO_CONTENT) // success pero no content return
  @Delete(':id')
  async removeUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.userService.deleteUser(id);
  }
}
