import { MoneyDiary } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { MoneyDiaryGetResponse } from './response/money-diary';
import { MoneyDiaryDto } from './dto/money-diary.create-dto';
import { Cron } from '@nestjs/schedule';
import { first } from 'rxjs';

@Injectable()
export class MoneyDiaryService {
  constructor(private prisma: PrismaService) {}
  @Cron('0 0 1 * *')
  async handleCron() {
    await this.regularCreateMoneyDiary();
  }

  //** 毎月1に定期登録を実行 */
  public async regularCreateMoneyDiary() {
    const date = new Date();
    const automaticRegistrationMoneyDiaries =
      await this.prisma.moneyDiary.findMany({
        where: {
          automaticRegistration: true,
          date: {
            gte: new Date(date.getFullYear(), date.getMonth() - 1),
            lt: new Date(date.getFullYear(), date.getMonth()),
          },
        },
        include: {
          categories: { select: { category: { select: { id: true } } } },
        },
      });

    automaticRegistrationMoneyDiaries.forEach(async (moneyDiary) => {
      const nextMonth = new Date(
        moneyDiary.date.getFullYear(),
        moneyDiary.date.getMonth() + 1,
        moneyDiary.date.getDate(),
      );
      await this.prisma.moneyDiary.create({
        data: {
          userId: moneyDiary.userId,
          memo: moneyDiary.memo,
          expenseItemName: moneyDiary.expenseItemName,
          payment: moneyDiary.payment,
          withdrawal: moneyDiary.withdrawal,
          date: nextMonth,
          categories: {
            create: moneyDiary.categories.map((category) => {
              return { categoryId: category.category.id };
            }),
          },
          automaticRegistration: moneyDiary.automaticRegistration,
        },
      });
    });
  }

  //** 家計簿全件取得 */
  public async getMoneyDiaries(
    userId: number,
  ): Promise<MoneyDiaryGetResponse[]> {
    const moneyDiaries = await this.prisma.moneyDiary.findMany({
      where: { userId },
      include: {
        categories: {
          select: { category: { select: { id: true, name: true } } },
        },
      },
      orderBy: { date: 'desc' },
    });
    const moneyDiaryGetResponse = moneyDiaries.map(
      (moneyDiary) => new MoneyDiaryGetResponse(moneyDiary),
    );
    return moneyDiaryGetResponse;
  }

  /** 該当年の家計簿取得 */
  public async getMoneyDiariesByYear(
    userId: number,
    year: string | number,
    month?: string,
    orderByIncomeAndExpenditure?: 'payment' | 'withdrawal',
    orderByDate: 'asc' | 'desc' = 'asc',
  ): Promise<MoneyDiaryGetResponse[]> {
    const gt = new Date(String(year) + `/${month}`);
    const lt = new Date(gt.getTime());
    lt.setMonth(gt.getMonth() + 1);
    const isPaymentSort = orderByIncomeAndExpenditure === 'payment';

    if (!userId) {
      return [];
    }
    const moneyDiaries = await this.prisma.moneyDiary.findMany({
      where: {
        userId,
        date: {
          gt,
          lt,
        },
      },
      include: {
        categories: {
          select: { category: { select: { name: true, id: true } } },
        },
      },
      orderBy: !orderByIncomeAndExpenditure
        ? [{ date: orderByDate }, { payment: 'desc' }, { withdrawal: 'asc' }]
        : [
            { payment: isPaymentSort ? 'desc' : 'asc' },
            { withdrawal: isPaymentSort ? 'asc' : 'desc' },
          ],
    });
    const moneyDiaryGetResponse = moneyDiaries.map(
      (moneyDiary) => new MoneyDiaryGetResponse(moneyDiary),
    );

    return moneyDiaryGetResponse;
  }

  public async getMoneyDiariesByMonth(userId: number, month: string) {
    const moneyDiaries = await this.prisma.moneyDiary.findMany({
      where: {
        userId,
        date: {
          gt: new Date('2022/08'),
          lt: new Date('2022/09'),
        },
      },
      include: {
        categories: {
          select: { category: { select: { name: true, id: true } } },
        },
      },
    });
    const moneyDiaryGetResponse = moneyDiaries.map(
      (moneyDiary) => new MoneyDiaryGetResponse(moneyDiary),
    );
    const sort = moneyDiaryGetResponse.sort(
      (a, b) => a.incomeAndExpenditure - b.incomeAndExpenditure,
    );
    console.log(sort);

    return sort;
  }

  /** 家計簿登録 */
  public async createMoneyDiary(
    userId: number,
    request: MoneyDiaryDto,
  ): Promise<MoneyDiary> {
    const {
      memo,
      withdrawal,
      payment,
      date,
      automaticRegistration,
      expenseItemName,
      categories,
    } = request;

    const categoryIdList = categories.map((category) => {
      return { categoryId: category };
    });
    const createResult = await this.prisma.moneyDiary.create({
      data: {
        userId,
        memo,
        withdrawal,
        payment,
        date,
        automaticRegistration,
        expenseItemName,
        categories: {
          create: categoryIdList,
        },
      },
    });
    return createResult;
  }

  /** 家計簿更新 */
  public async updateMoneyDiary(
    userId: number,
    id: number,
    request: MoneyDiaryDto,
  ): Promise<MoneyDiary> {
    const {
      memo,
      withdrawal,
      payment,
      date,
      automaticRegistration,
      expenseItemName,
      categories,
    } = request;
    const categoryIdList = categories.map((category) => {
      return { categoryId: category };
    });
    const deleteResult = this.prisma.moneyDiary_Category.deleteMany({
      where: { moneyDiaryId: id },
    });
    const updateResult = this.prisma.moneyDiary.update({
      where: { id },
      data: {
        userId,
        memo,
        withdrawal,
        payment,
        date,
        automaticRegistration,
        expenseItemName,
        categories: {
          create: categoryIdList,
        },
      },
    });
    await this.prisma.$transaction([deleteResult, updateResult]);
    return updateResult;
  }

  public async deleteMoneyDiary(id: number) {
    const deleteCategories = this.prisma.moneyDiary_Category.deleteMany({
      where: { moneyDiaryId: id },
    });
    const deleteMoneyDiary = this.prisma.moneyDiary.delete({ where: { id } });
    await this.prisma.$transaction([deleteCategories, deleteMoneyDiary]);
    return deleteMoneyDiary;
  }
}
