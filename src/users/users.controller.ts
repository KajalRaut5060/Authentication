import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Public()
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  //Get all users
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  //Create user
  @Post()
  createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }
}
