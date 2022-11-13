import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsString } from 'class-validator';

export class UserCreateDto implements Omit<User, 'id'> {
  @ApiProperty()
  @IsString()
  uid: string;

  @ApiProperty()
  @IsString()
  email: string;
}
