import { PrismaService } from '../prisma.service';
import { MoneyDiaryService } from './money-diary.service';
import { MoneyDiaryController } from './money-diary.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [MoneyDiaryController],
  providers: [MoneyDiaryService, PrismaService],
})
export class MoneyDiaryModule {}
