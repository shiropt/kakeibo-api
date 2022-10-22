import { MoneyDiary } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { MoneyDiaryGetResponse } from './response/money-diary';
import { MoneyDiaryDto } from './dto/money-diary.create-dto';

@Injectable()
export class MoneyDiaryService {
  constructor(private prisma: PrismaService) {}

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
  ): Promise<MoneyDiaryGetResponse[]> {
    const gt = new Date(String(year) + `/${month}`);
    const lt = new Date(gt.getTime());
    lt.setMonth(gt.getMonth() + 1);

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
      orderBy: { date: 'asc' },
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
    return moneyDiaryGetResponse;
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
      period,
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
        period,
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
      period,
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
        period,
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
