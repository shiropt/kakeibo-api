import { UserService } from './../user/user.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    return this.userService.getUser(parseInt(id, 10));
  }

  @Post()
  async createUser(@Body() user: Prisma.UserCreateInput): Promise<User> {
    return this.userService.createUser(user);
  }
}
