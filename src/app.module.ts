import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MoneyDiaryModule } from './money-diary/money-diary.module';
import { CategoryModule } from './category/category.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    UserModule,
    MoneyDiaryModule,
    CategoryModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
