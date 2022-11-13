import { UserService } from './../user/user.service';
import { Body, Controller, Post } from '@nestjs/common';
import { UserCreateDto } from './dto/userCreateDto';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() user: UserCreateDto) {
    return await this.userService.googleSignin(user);
  }
}
