import { MoneyDiaryDto } from './money-diary.dto';
import { MoneyDiaryService } from './money-diary.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('api/v1/money-diary')
export class MoneyDiaryController {
  constructor(private readonly moneyDiaryService: MoneyDiaryService) {}

  @Get(':id')
  async getMoneyDiary(@Param('id') id: string): Promise<MoneyDiaryDto[]> {
    return this.moneyDiaryService.getMoneyDiaries(parseInt(id, 10));
  }
}
