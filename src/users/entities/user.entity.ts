import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserStatus } from 'src/common/enums/status.enum';
import { UserRole } from 'src/common/enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  fullName: string;

  @Column({
    type: 'enum',
    default: UserStatus.Single,
    enum: UserStatus,
  })
  status: UserStatus;

  @Column()
  age: number;

  @Column({
    type: 'enum',
    default: UserRole.Employee,
    enum: UserRole,
  })
  Role: UserRole;
}
