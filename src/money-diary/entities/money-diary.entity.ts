import { MoneyDiary as MoneyDiaryModel } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class MoneyDiary implements MoneyDiaryModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  memo: string | null;

  @ApiProperty()
  withdrawal: number;

  @ApiProperty()
  payment: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  automaticRegistration: boolean;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  expenseItemName: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
