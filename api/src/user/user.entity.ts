import { CommonEntity } from 'src/common/base.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { UserRole } from './user.interface';

@Entity('users')
export class UserEntity extends CommonEntity {
  @Column()
  name: string;
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  roles: UserRole;
  @Column({ unique: true })
  email: string;
  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
