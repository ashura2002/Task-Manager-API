import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JWTResponse } from './types/JwtInterface.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDTO: LoginDTO): Promise<JWTResponse> {
    const user = await this.userService.findByUsername(loginDTO);
    if (!user) throw new UnauthorizedException();

    // check password if being hash
    const isPasswordMatch = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (!isPasswordMatch)
      throw new UnauthorizedException('Invalid Credentials');

    const payload = {
      sub: user.id,
      role: user.role,
      email: user.email,
      username: user.username,
    };
    const token = this.jwtService.sign(payload);
    return {
      accessToken: token,
    };
  }

  async register(createUserDTO: CreateUserDTO): Promise<User> {
    const user = await this.userService.create(createUserDTO);
    return user;
  }
}
