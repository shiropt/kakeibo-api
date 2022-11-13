import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(
    email: string,
    uid: string,
  ): Promise<Omit<User, 'uid'> | null> {
    const user = await this.userService.getUser(email);
    if (user && user.uid === uid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { uid, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: Omit<User, 'password'>) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }
}
