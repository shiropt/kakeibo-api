import { UserService } from './../user/user.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':email')
  async getUser(@Param('email') email: string): Promise<User> {
    return this.userService.getUser(email);
  }

  @Post()
  async createUser(@Body() user: Prisma.UserCreateInput): Promise<User> {
    return this.userService.createUser(user);
  }
}
