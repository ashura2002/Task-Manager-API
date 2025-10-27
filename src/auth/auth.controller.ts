import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { JWTResponse } from './types/JwtInterface.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDTO: LoginDTO): Promise<JWTResponse> {
    return await this.authService.login(loginDTO);
  }

  @Post('/register')
  async register(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<Omit<User, 'password'>> {
    return await this.authService.register(createUserDTO);
  }
}
