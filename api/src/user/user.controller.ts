import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { User, UserRole } from './user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/')
  create(@Body() user: User): Observable<User | any> {
    return this.userService.create(user).pipe(
      map((user) => {
        return user;
      }),
      catchError((err) => of({ error: err })),
    );
  }
  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/')
  findAll(): Observable<User[]> {
    return this.userService.findAll();
  }
  @Get('/:id')
  findOne(@Param('id') id: string): Observable<User> {
    return this.userService.find(id);
  }
  @Put('/:id')
  updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
    return this.userService.updateOne(id, user);
  }
  @Delete('/:id')
  deleteOne(@Param('id') id: string): Observable<any> {
    return this.userService.deleteOne(id);
  }
  @Post('/login')
  login(@Body() user: User): Observable<any> {
    return this.userService.login(user).pipe(
      map((jwt) => {
        return {
          access_token: jwt,
        };
      }),
      catchError((err) => {
        return of({ error: err.message });
      }),
    );
  }
  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/:id/role')
  updateUserRoleById(
    @Param('id') id: string,
    @Body() user: User,
  ): Observable<any> {
    return this.userService.updateUserRole(id, user);
  }
}
