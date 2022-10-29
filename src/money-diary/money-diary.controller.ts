import { MoneyDiaryDto } from './dto/money-diary.create-dto';
import { MoneyDiaryGetResponse } from './response/money-diary';
// import { MoneyDiary } from '@prisma/client';
import { ApiOkResponse } from '@nestjs/swagger';
import { MoneyDiaryService } from './money-diary.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MoneyDiary } from './entities/money-diary.entity';
@Controller('api/v1/money-diary')
export class MoneyDiaryController {
  constructor(private readonly moneyDiaryService: MoneyDiaryService) {}

  //** 家計簿全件取得 */
  @Get()
  @ApiOkResponse({ type: MoneyDiaryGetResponse, isArray: true })
  private async getMoneyDiary(
    @Headers('userId') userId: string,
  ): Promise<MoneyDiaryGetResponse[]> {
    return this.moneyDiaryService.getMoneyDiaries(+userId);
  }

  /** 該当年の家計簿取得 */
  @Get('search')
  @ApiOkResponse({ type: MoneyDiaryGetResponse, isArray: true })
  private async getMoneyDiaryByYear(
    @Query('year') year: string,
    @Query('month') month: string,
    @Query('orderByDate') orderByDate: 'asc' | 'desc',
    @Query('orderByIncomeAndExpenditure')
    orderByIncomeAndExpenditure: 'payment' | 'withdrawal',
    @Headers('userId')
    userId: string,
  ): Promise<MoneyDiaryGetResponse[]> {
    return this.moneyDiaryService.getMoneyDiariesByYear(
      +userId,
      year,
      month,
      orderByIncomeAndExpenditure,
      orderByDate,
    );
  }
  /** 該当月の家計簿取得 */
  @Get('month')
  @ApiOkResponse({ type: MoneyDiaryGetResponse, isArray: true })
  private async getMoneyDiaryByMonth(
    @Query('month') month: string,
    @Headers('userId') userId: string,
  ): Promise<MoneyDiaryGetResponse[]> {
    return this.moneyDiaryService.getMoneyDiariesByMonth(+userId, month);
  }

  /** 家計簿登録 */
  @Post()
  private async createMoneyDiary(
    @Headers('userId') userId: string,
    @Body() moneyDiary: MoneyDiaryDto,
  ): Promise<MoneyDiary> {
    return this.moneyDiaryService.createMoneyDiary(+userId, moneyDiary);
  }

  /** 家計簿更新 */
  @Put(':id')
  private async updateMoneyDiary(
    @Headers('userId') userId: string,
    @Param('id') id: string,
    @Body() moneyDiary: MoneyDiaryDto,
  ): Promise<MoneyDiary> {
    return this.moneyDiaryService.updateMoneyDiary(+userId, +id, moneyDiary);
  }

  @Delete(':id')
  private async deleteMoneyDiary(@Param('id') id: string) {
    return this.moneyDiaryService.deleteMoneyDiary(+id);
  }
}
