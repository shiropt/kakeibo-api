import { UserService } from './../user/user.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User as UserModel, Prisma } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserModel | null> {
    return this.userService.getUser(parseInt(id, 10));
  }

  @Get()
  async getUsers(): Promise<UserModel[] | null> {
    return this.userService.getUsers();
  }

  @Post()
  async createUser(@Body() user: Prisma.UserCreateInput): Promise<UserModel> {
    return this.userService.createUser(user);
  }
}
