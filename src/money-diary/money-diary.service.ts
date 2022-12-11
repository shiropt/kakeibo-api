import { MoneyDiary } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import {
  Aggregate,
  AggregateResponse,
  MoneyDiaryGetResponse,
} from './response/money-diary';
import { MoneyDiaryDto } from './dto/money-diary.create-dto';
import { Cron } from '@nestjs/schedule';

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
  public async getMoneyDiariesByMonth(
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

  /**年別の出費/入金合計を取得 */
  public async getAggregateMoneyDiaries(
    userId: number,
  ): Promise<AggregateResponse> {
    /**日付、入金、出金カラムのみの家計簿を取得 */
    const moneyDiaries = await this.getMoneyDiaryAmounts(userId);

    /** 年別に集計した家計簿 */
    const aggregateByYear = await this.groupByDate(moneyDiaries, 'year');

    /** 月別に集計した家計簿 */
    const aggregateByMonth = await this.groupByDate(moneyDiaries, 'month');

    /**総合計取得 */
    const aggregateAmount = await this.prisma.moneyDiary.aggregate({
      _sum: {
        withdrawal: true,
        payment: true,
      },
      where: { userId },
    });

    const comprehensive = {
      ...aggregateAmount._sum,
      incomeAndExpenditure:
        aggregateAmount._sum.withdrawal - aggregateAmount._sum.payment,
    };

    return {
      aggregateByYear,
      aggregateByMonth,
      comprehensive,
    };
  }

  private async getMoneyDiaryAmounts(userId: number) {
    return await this.prisma.moneyDiary.findMany({
      where: { userId },
      select: {
        date: true,
        withdrawal: true,
        payment: true,
      },
      orderBy: { date: 'asc' },
    });
  }

  /**  年 or 月でグループ化 */
  private async groupByDate(
    moneyDiaries: Pick<MoneyDiary, 'date' | 'withdrawal' | 'payment'>[],
    groupBy: 'year' | 'month',
  ): Promise<Aggregate[]> {
    return moneyDiaries
      .map((moneyDiary) => {
        return {
          withdrawal: moneyDiary.withdrawal,
          payment: moneyDiary.payment,
          date:
            groupBy === 'year'
              ? moneyDiary.date.getFullYear().toString()
              : `${moneyDiary.date.getFullYear()}-${
                  moneyDiary.date.getMonth() + 1
                }`,
        };
      })
      .reduce((prev, current) => {
        // まず該当の年度があるかを判定する
        const element = prev.find((p) => p.date === current.date);
        if (element) {
          element.withDrawal += current.withdrawal; // sum
          element.payment += current.payment; // sum
          // 該当の年度がなければprevに今の周回のデータをプッシュする
        } else {
          prev.push({
            date: current.date,
            withDrawal: current.withdrawal,
            payment: current.payment,
          });
        }
        return prev;
      }, [])
      .map((moneyDiary) => {
        return {
          ...moneyDiary,
          incomeAndExpenditure: moneyDiary.withDrawal - moneyDiary.payment,
        };
      });
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
