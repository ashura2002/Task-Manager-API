import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from './dto/update-user.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserRole } from 'src/common/enums/user-role.enum';
import { LoginDTO } from 'src/auth/dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const user = await this.userRepo.find();
    return user;
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const { email, role } = createUserDTO;
    const existingUser = await this.userRepo.findOne({
      where: { email },
    });
    if (existingUser) throw new BadRequestException('Email already exist');

    const validRoles = Object.values(UserRole);
    if (!validRoles.includes(role)) {
      throw new BadRequestException(
        `Invalid role: ${role}. Role must be either Admin or Employee.`,
      );
    }
    const user = this.userRepo.create(createUserDTO);
    await this.userRepo.save(user);
    console.log('after save', user);
    return user;
  }

  async update(id: number, updateUserDTO: UpdateUserDTO): Promise<User> {
    const existingUser = await this.userRepo.findOne({
      where: { id },
    });
    if (!existingUser) throw new NotFoundException('User not found');

    // if true or included to change
    if (updateUserDTO.password) {
      const hashUpdatedPass = await bcrypt.hash(updateUserDTO.password, 10);
      updateUserDTO.password = hashUpdatedPass;
    }

    Object.assign(existingUser, updateUserDTO);
    const user = await this.userRepo.save(existingUser);
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    // pag void no return
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.userRepo.remove(user);
  }

  async findByUsername(loginDTO: LoginDTO): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { username: loginDTO.username },
    });
    if (!user) throw new UnauthorizedException('Invalid Credentials');
    return user;
  }
}
