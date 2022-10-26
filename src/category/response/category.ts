import { ApiProperty } from '@nestjs/swagger';
import { Category as CategoryModel } from '@prisma/client';

export class Category implements CategoryModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
