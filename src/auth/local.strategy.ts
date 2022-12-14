import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(
    email: string,
    uid: string,
  ): Promise<Omit<User, 'uid'> | UnauthorizedException> {
    const user = await this.authService.validateUser(email, uid);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
