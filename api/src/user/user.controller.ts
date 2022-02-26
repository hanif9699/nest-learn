import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from './user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/')
  create(@Body() user: User): Observable<User> {
    return this.userService.create(user);
  }
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
    console.log(id);
    return this.userService.deleteOne(id);
  }
}
