import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async findAll() {
    const user = await this.userRepository.findAll();
    return {
      message: `${user.length === 0 ? 'No Users Found' : 'List Of Users'}`,
      user,
    };
  }

  async findById(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException('User not found!');
    return { message: `User details of ${id}`, user };
  }

  // move to auth service
  async create(createUserDTO: CreateUserDTO) {
    const existedUser = await this.userRepository.findByEmail(
      createUserDTO.email,
    );
    if (existedUser) throw new BadRequestException('Email already exist!');
    const user = await this.userRepository.create(createUserDTO);
    return { message: 'Created Successfully', user };
  }
}

// complete first the crud before moving the create user on auth module
