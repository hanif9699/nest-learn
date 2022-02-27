import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { User } from 'src/user/user.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user.user;
    // console.log(request);
    return this.userService.find(user.id).pipe(
      map((dbUser: User) => {
        const hasRoles: boolean = roles.indexOf(dbUser.roles) > -1;
        let hasPermission = false;
        if (hasRoles) {
          hasPermission = true;
        }
        return user && hasPermission;
      }),
    );
  }
}
