import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  create(user: User): Observable<User> {
    return from(this.userRepo.save(user));
  }
  findAll(): Observable<User[]> {
    return from(this.userRepo.find());
  }
  deleteOne(id: string): Observable<any> {
    return from(this.userRepo.delete(id));
  }
  updateOne(id: string, user: User): Observable<any> {
    return from(this.userRepo.update(id, user));
  }
  find(id: string): Observable<User> {
    return from(this.userRepo.findOne({ where: { id } }));
  }
}
