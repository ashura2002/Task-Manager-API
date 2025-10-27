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

    //check if password is being hash
    const isPasswordMatch = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );
    if (!isPasswordMatch)
      throw new UnauthorizedException('Incorrect Credentials');

    // define the shape of tokwn
    const payload = {
      userId: user.id,
      role: user.role,
      email: user.email,
      username: user.username,
    };

    // generate token
    const accessToken = this.jwtService.sign(payload);
    return { message: 'Login Successfully', accessToken };
  }

  async register(createUserDTO: CreateUserDTO): Promise<User> {
    const user = await this.userService.create(createUserDTO);
    return user;
  }
}
