import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { User, UserRole } from './user.interface';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  create(user: User): Observable<User> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((hashPassword: string) => {
        const newUser = new UserEntity();
        newUser.name = user.name;
        newUser.email = user.email;
        newUser.username = user.username;
        newUser.password = hashPassword;
        newUser.roles = UserRole.USER;
        return from(this.userRepo.save(newUser)).pipe(
          map((savedUser: User) => {
            const { password, ...results } = savedUser;
            return results;
          }),
          catchError((err) => throwError(() => err)),
        );
      }),
    );
  }
  findAll(): Observable<User[]> {
    return from(this.userRepo.find()).pipe(
      map((users: User[]) => {
        users.forEach((items) => {
          delete items.password;
        });
        return users;
      }),
    );
  }
  deleteOne(id: string): Observable<any> {
    return from(this.userRepo.delete(id));
  }
  updateOne(id: string, user: User): Observable<any> {
    delete user.email;
    delete user.password;
    delete user.roles;
    return from(this.userRepo.update(id, user));
  }
  find(id: string): Observable<User> {
    return from(this.userRepo.findOne({ where: { id } })).pipe(
      map((user: User) => {
        console.log(user);
        const { password, ...results } = user;
        return results;
      }),
    );
  }
  login(user: User): Observable<string> {
    return this.validate(user.email, user.password).pipe(
      switchMap((authUser: User) => {
        return this.authService.generateToken(authUser).pipe(
          map((token) => {
            return token;
          }),
        );
      }),
    );
  }
  validate(email: string, password: string): Observable<User> {
    return this.findUserByEmail(email).pipe(
      switchMap((user: User) => {
        return this.authService.comparePassword(password, user.password).pipe(
          map((match: boolean) => {
            if (match) {
              const { password, ...results } = user;
              return results;
            } else {
              throw new Error('Wrong Creditenals');
            }
          }),
        );
      }),
    );
  }
  findUserByEmail(email: string): Observable<User> {
    return from(this.userRepo.findOne({ where: { email } }));
  }
  updateUserRole(id: string, user: User): Observable<any> {
    return from(this.userRepo.update(id, user));
  }
  paginate(options: IPaginationOptions): Observable<Pagination<User>> {
    return from(paginate<UserEntity>(this.userRepo, options)).pipe(
      map((userPageable: Pagination<User>) => {
        userPageable.items.forEach((value) => {
          delete value.password;
        });
        return userPageable;
      }),
    );
  }
}
