import { MoneyDiary } from '@prisma/client';
import { MoneyDiaryDto } from './money-diary.dto';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MoneyDiaryService {
  constructor(private prisma: PrismaService) {}

  //** 家計簿全件取得 */
  public async getMoneyDiaries(userId: number): Promise<MoneyDiaryDto[]> {
    const moneyDiaries = await this.prisma.moneyDiary.findMany({
      where: { userId },
      include: {
        categories: {
          select: { category: { select: { id: true, name: true } } },
        },
      },
      orderBy: { date: 'asc' },
    });
    const moneyDiaryDto = moneyDiaries.map(
      (moneyDiary) => new MoneyDiaryDto(moneyDiary),
    );
    return moneyDiaryDto;
  }

  /** 該当年の家計簿取得 */
  public async getMoneyDiariesByYear(
    userId: number,
    year: string,
  ): Promise<MoneyDiaryDto[]> {
    const nextYear = String(Number(year) + 1);
    const moneyDiaries = await this.prisma.moneyDiary.findMany({
      where: {
        userId,
        date: {
          gt: new Date(year),
          lt: new Date(nextYear),
        },
      },
      include: {
        categories: {
          select: { category: { select: { name: true, id: true } } },
        },
      },
      orderBy: { date: 'asc' },
    });
    const moneyDiaryDto = moneyDiaries.map(
      (moneyDiary) => new MoneyDiaryDto(moneyDiary),
    );
    return moneyDiaryDto;
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
      return { categoryId: category.id };
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
      id,
    } = request;
    const categoryIdList = categories.map((category) => {
      return { categoryId: category.id };
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
