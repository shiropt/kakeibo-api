import { MoneyDiaryDto } from './money-diary.dto';
import { MoneyDiaryService } from './money-diary.service';
import { Controller, Get, Headers, Param, Query } from '@nestjs/common';

@Controller('api/v1/money-diary')
export class MoneyDiaryController {
  constructor(private readonly moneyDiaryService: MoneyDiaryService) {}

  //** 家計簿全件取得 */
  @Get()
  async getMoneyDiary(
    @Headers('userId') userId: string,
  ): Promise<MoneyDiaryDto[]> {
    return this.moneyDiaryService.getMoneyDiaries(parseInt(userId, 10));
  }

  /** 該当年の家計簿取得 */
  @Get('/query')
  async getMoneyDiaryByYear(
    @Query('year') year: string,
    @Headers('userId') userId: string,
  ): Promise<MoneyDiaryDto[]> {
    return this.moneyDiaryService.getMoneyDiariesByYear(
      parseInt(userId, 10),
      year,
    );
  }
}
