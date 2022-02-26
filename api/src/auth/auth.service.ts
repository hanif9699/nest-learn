import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';
import { User } from 'src/user/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: User): Observable<string> {
    return from(this.jwtService.signAsync(payload));
  }
  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }
  comparePassword(password: string, passwordHash: string): Observable<boolean> {
    return from(bcrypt.compare(password, passwordHash));
  }
}
