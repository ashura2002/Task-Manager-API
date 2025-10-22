import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserRole } from 'src/common/enums/role.enum';

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

  async create(createUserDTO: CreateUserDTO) {
    const existedUser = await this.userRepository.findByEmail(
      createUserDTO.email,
    );
    if (existedUser) throw new BadRequestException('Email already exist!');

    const validRoles = Object.values(UserRole);
    if (createUserDTO.Role && !validRoles.includes(createUserDTO.Role)) {
      throw new BadRequestException(
        `Invalid Role ${createUserDTO.Role}, Roles must be either Admin or Employee`,
      );
    }
    const user = await this.userRepository.create(createUserDTO);
    return { message: 'Created Successfully', user };
  }

  async editUser(id: number, updateUserDTO: UpdateUserDTO) {
    const user = await this.userRepository.edit(id, updateUserDTO);
    return { message: 'Updated Successfully', user };
  }

  async deleteUser(id: number) {
    const user = await this.userRepository.delete(id);
    return { message: 'Deleted Successfully', user };
  }
}
