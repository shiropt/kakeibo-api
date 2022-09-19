import { MoneyDiary } from '@prisma/client';

export class MoneyDiaryDto
  implements Omit<MoneyDiary, 'userId' | 'expenseItemId'>
{
  constructor(
    id: number,
    memo: string,
    withdrawal: number,
    payment: number,
    date: Date,
    period: number,
    expenseItemName: string,
    categories: string[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.memo = memo;
    this.withdrawal = withdrawal;
    this.payment = payment;
    this.date = date;
    this.period = period;
    this.expenseItemName = expenseItemName;
    this.categories = categories;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
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
