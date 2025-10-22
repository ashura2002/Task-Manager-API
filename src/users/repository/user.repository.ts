import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dto/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
    });
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const user = this.repo.create(createUserDTO);
    const savedUser = await this.repo.save(user);
    return savedUser;
  }

  async findByEmail(email: string) {
    return this.repo.findOne({
      where: { email: email },
    });
  }
}
