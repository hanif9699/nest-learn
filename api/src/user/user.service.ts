import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { User } from './user.interface';

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
    return from(this.userRepo.update(id, user));
  }
  find(id: string): Observable<User> {
    return from(this.userRepo.findOne({ where: { id } })).pipe(
      map((user: User) => {
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
              throw new Error();
            }
          }),
        );
      }),
    );
  }
  findUserByEmail(email: string): Observable<User> {
    return from(this.userRepo.findOne({ where: { email } }));
  }
}
