import { MoneyDiary } from '@prisma/client';
import { MoneyDiaryDto } from './money-diary.dto';
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

@Controller('api/v1/money-diary')
export class MoneyDiaryController {
  constructor(private readonly moneyDiaryService: MoneyDiaryService) {}

  //** 家計簿全件取得 */
  @Get()
  private async getMoneyDiary(
    @Headers('userId') userId: string,
  ): Promise<MoneyDiaryDto[]> {
    return this.moneyDiaryService.getMoneyDiaries(parseInt(userId, 10));
  }

  /** 該当年の家計簿取得 */
  @Get('/query')
  private async getMoneyDiaryByYear(
    @Query('year') year: string,
    @Headers('userId') userId: string,
  ): Promise<MoneyDiaryDto[]> {
    return this.moneyDiaryService.getMoneyDiariesByYear(
      parseInt(userId, 10),
      year,
    );
  }

  /** 家計簿登録 */
  @Post()
  private async createMoneyDiary(
    @Headers('userId') userId: string,
    @Body() moneyDiary: MoneyDiaryDto,
  ): Promise<MoneyDiary> {
    return this.moneyDiaryService.createMoneyDiary(
      parseInt(userId, 10),
      moneyDiary,
    );
  }

  /** 家計簿更新 */
  @Put()
  private async updateMoneyDiary(
    @Headers('userId') userId: string,
    @Body() moneyDiary: MoneyDiaryDto,
  ): Promise<MoneyDiary> {
    return this.moneyDiaryService.updateMoneyDiary(
      parseInt(userId, 10),
      moneyDiary,
    );
  }

  @Delete(':id')
  private async deleteMoneyDiary(@Param('id') id: string) {
    return this.moneyDiaryService.deleteMoneyDiary(parseInt(id, 10));
  }
}
