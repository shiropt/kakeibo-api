import { MoneyDiaryDto } from './dto/money-diary.create-dto';
import {
  AggregateResponse,
  MoneyDiaryGetResponse,
} from './response/money-diary';
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
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { MoneyDiary } from './entities/money-diary.entity';
import { User } from '@prisma/client';
@Controller('api/v1/money-diary')
@UseGuards(AuthGuard('jwt'))
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
    @Request() request: { user: Omit<User, 'password'> },
  ): Promise<MoneyDiaryGetResponse[]> {
    return this.moneyDiaryService.getMoneyDiariesByMonth(
      request.user.id,
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

  /**年別の出費/入金合計を取得 */
  @Get('aggregate')
  @ApiOkResponse({ type: AggregateResponse })
  private async getAggregateMoneyDiaries(
    @Request() request: { user: Omit<User, 'password'> },
  ): Promise<AggregateResponse> {
    return this.moneyDiaryService.getAggregateMoneyDiaries(request.user.id);
  }

  /** 家計簿登録 */
  @Post()
  private async createMoneyDiary(
    @Request() request: { user: Omit<User, 'password'> },
    @Body() moneyDiary: MoneyDiaryDto,
  ): Promise<MoneyDiary> {
    return this.moneyDiaryService.createMoneyDiary(request.user.id, moneyDiary);
  }

  /** 家計簿更新 */
  @Put(':id')
  private async updateMoneyDiary(
    @Request() request: { user: Omit<User, 'password'> },
    @Param('id') id: string,
    @Body() moneyDiary: MoneyDiaryDto,
  ): Promise<MoneyDiary> {
    return this.moneyDiaryService.updateMoneyDiary(
      request.user.id,
      +id,
      moneyDiary,
    );
  }

  @Delete(':id')
  private async deleteMoneyDiary(@Param('id') id: string) {
    return this.moneyDiaryService.deleteMoneyDiary(+id);
  }
}
