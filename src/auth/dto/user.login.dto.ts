import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserLoginDto {
  @ApiProperty()
  username: string; // email

  @ApiProperty()
  @IsString()
  password: string; // uid
}
