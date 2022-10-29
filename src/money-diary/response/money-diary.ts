import { MoneyDiary } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

type MoneyDiaryWithCategories = MoneyDiary & {
  categories: {
    category: {
      id: number;
      name: string;
    };
  }[];
};
export class MoneyDiaryGetResponse implements Omit<MoneyDiary, 'userId'> {
  constructor(moneyDiary: MoneyDiaryWithCategories) {
    this.id = moneyDiary.id;
    this.memo = moneyDiary.memo;
    this.withdrawal = moneyDiary.withdrawal;
    this.payment = moneyDiary.payment;
    this.date = moneyDiary.date;
    this.automaticRegistration = moneyDiary.automaticRegistration;
    this.expenseItemName = moneyDiary.expenseItemName;
    this.categories = moneyDiary.categories.map((obj) => obj.category);
    this.createdAt = moneyDiary.createdAt;
    this.updatedAt = moneyDiary.updatedAt;
    this.incomeAndExpenditure = moneyDiary.withdrawal - moneyDiary.payment;
  }
  @ApiProperty()
  id: number;

  @ApiProperty()
  memo: string;

  @ApiProperty()
  withdrawal: number;

  @ApiProperty()
  payment: number;

  @ApiProperty()
  incomeAndExpenditure: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  automaticRegistration: boolean;

  @ApiProperty()
  expenseItemName: string;

  @ApiProperty()
  categories: { id: number; name: string }[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
