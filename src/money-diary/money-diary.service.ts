import { MoneyDiaryDto } from './money-diary.dto';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MoneyDiaryService {
  constructor(private prisma: PrismaService) {}

  //** 家計簿全件取得 */
  async getMoneyDiaries(userId: number): Promise<MoneyDiaryDto[]> {
    const moneyDiaries = await this.prisma.moneyDiary.findMany({
      where: { userId },
      include: {
        categories: { select: { category: { select: { name: true } } } },
      },
      orderBy: { date: 'asc' },
    });
    const moneyDiaryDto = moneyDiaries.map(
      (moneyDiary) => new MoneyDiaryDto(moneyDiary),
    );
    return moneyDiaryDto;
  }

  /** 該当年の家計簿取得 */
  async getMoneyDiariesByYear(
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
        categories: { select: { category: { select: { name: true } } } },
      },
      orderBy: { date: 'asc' },
    });
    const moneyDiaryDto = moneyDiaries.map(
      (moneyDiary) => new MoneyDiaryDto(moneyDiary),
    );
    return moneyDiaryDto;
  }
}
