import { MoneyDiary } from '@prisma/client';

type MoneyDiaryWithCategories = MoneyDiary & {
  categories: {
    category: {
      name: string;
    };
  }[];
};
export class MoneyDiaryDto implements Omit<MoneyDiary, 'userId'> {
  constructor(moneyDiary: MoneyDiaryWithCategories) {
    this.id = moneyDiary.id;
    this.memo = moneyDiary.memo;
    this.withdrawal = moneyDiary.withdrawal;
    this.payment = moneyDiary.payment;
    this.date = moneyDiary.date;
    this.period = moneyDiary.period;
    this.expenseItemName = moneyDiary.expenseItemName;
    this.categories = moneyDiary.categories.map((obj) => obj.category.name);
    this.createdAt = moneyDiary.createdAt;
    this.updatedAt = moneyDiary.updatedAt;
  }
  id: number;
  memo: string;
  withdrawal: number;
  payment: number;
  date: Date;
  period: number;
  expenseItemName: string;
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}