import { MoneyDiaryDto } from './money-diary.dto';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MoneyDiaryService {
  constructor(private prisma: PrismaService) {}

  async getMoneyDiaries(userId: number): Promise<MoneyDiaryDto[]> {
    const moneyDiaries = await this.prisma.moneyDiary.findMany({
      where: { userId },
      include: {
        categories: { select: { category: { select: { name: true } } } },
      },
    });

    const moneyDiaryDto = moneyDiaries.map((moneyDiary) => {
      return new MoneyDiaryDto(
        moneyDiary.id,
        moneyDiary.memo,
        moneyDiary.withdrawal,
        moneyDiary.payment,
        moneyDiary.date,
        moneyDiary.period,
        moneyDiary.expenseItemName,
        moneyDiary.categories.map((obj) => obj.category.name),
        moneyDiary.createdAt,
        moneyDiary.updatedAt,
      );
    });

    return moneyDiaryDto;
  }
}
