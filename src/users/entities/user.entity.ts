import { Exclude } from 'class-transformer';
import { UserRole } from 'src/common/enums/user-role.enum';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from 'src/tasks/entities/task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  email: string;

  @Column()
  age: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Employee,
  })
  role: UserRole;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @OneToMany(() => Task, (task) => task.employee)
  tasks: Task[];
}
