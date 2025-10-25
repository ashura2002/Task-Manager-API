import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  // to do
  // need to generate token if success
  async login(loginDTO: LoginDTO): Promise<User> {
    const user = await this.userService.findByUsername(loginDTO);
    console.log('user', user);
    return user;
  }

  async signIn(createUserDTO: CreateUserDTO): Promise<User> {
    const user = await this.userService.create(createUserDTO);
    return user;
  }
}
