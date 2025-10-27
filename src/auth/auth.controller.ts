import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { JWTResponse } from './types/JwtInterface.types';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Role } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDTO: LoginDTO): Promise<JWTResponse> {
    return await this.authService.login(loginDTO);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @Role(UserRole.Admin)
  @Post('/register')
  async register(
    @Body() createUserDTO: CreateUserDTO,
  ): Promise<Omit<User, 'password'>> {
    return await this.authService.register(createUserDTO);
  }
}
