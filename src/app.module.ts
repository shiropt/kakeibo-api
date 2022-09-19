import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MoneyDiaryModule } from './money-diary/money-diary.module';

@Module({
  imports: [UserModule, MoneyDiaryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
