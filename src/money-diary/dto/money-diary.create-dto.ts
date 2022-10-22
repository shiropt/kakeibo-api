import { MoneyDiary } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsNumber,
  MaxLength,
  Max,
  ValidationArguments,
} from 'class-validator';

export class MoneyDiaryDto
  implements Omit<MoneyDiary, 'userId' | 'id' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty()
  @IsString()
  @MaxLength(255, {
    message(validationArguments: ValidationArguments) {
      return `${validationArguments.property}は256文字以上登録できません`;
    },
  })
  memo: string;

  @ApiProperty()
  @IsNotEmpty({
    message(validationArguments: ValidationArguments) {
      return `${validationArguments.property}は必須です`;
    },
  })
  @IsNumber()
  @Max(1_000_000_000, {
    message(validationArguments: ValidationArguments) {
      return `${validationArguments.property}は1,000,000,001以上登録できません`;
    },
  })
  withdrawal: number;

  @ApiProperty()
  @IsNotEmpty({
    message(validationArguments: ValidationArguments) {
      return `${validationArguments.property}は必須です`;
    },
  })
  @IsNumber()
  @Max(1_000_000_000, {
    message(validationArguments: ValidationArguments) {
      return `${validationArguments.property}は1,000,000,001以上登録できません`;
    },
  })
  payment: number;

  @ApiProperty()
  @IsNotEmpty({
    message(validationArguments: ValidationArguments) {
      return `${validationArguments.property}は必須です`;
    },
  })
  date: Date;

  @ApiProperty()
  @IsNumber()
  @Max(1_000_000_000, {
    message(validationArguments: ValidationArguments) {
      return `${validationArguments.property}は1,000,000,001以上登録できません`;
    },
  })
  period: number;

  @ApiProperty()
  @IsNotEmpty({
    message(validationArguments: ValidationArguments) {
      return `${validationArguments.property}は必須です`;
    },
  })
  @IsString()
  @MaxLength(255, {
    message(validationArguments: ValidationArguments) {
      return `${validationArguments.property}は256文字以上登録できません`;
    },
  })
  expenseItemName: string;

  @ApiProperty()
  @IsArray()
  categories: number[];
}
