import { CommonEntity } from 'src/common/base.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';

@Entity('users')
export class UserEntity extends CommonEntity {
  @Column()
  name: string;
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;
  @Column({ unique: true })
  email: string;
  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
