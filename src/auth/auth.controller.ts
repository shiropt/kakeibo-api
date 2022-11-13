import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UserLoginDto } from './dto/user.login.dto';
import { User } from '@prisma/client';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { LoginResponse } from './response/login.response';

@Controller('api/v1/auth')
@UseGuards(LocalAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiCreatedResponse({ status: 200, type: LoginResponse })
  async login(
    @Body() user: UserLoginDto,
    @Request()
    req: { user: User },
  ) {
    const result = this.authService.login(req.user);
    return result;
  }
}
