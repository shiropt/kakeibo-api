import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserLoginDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}
