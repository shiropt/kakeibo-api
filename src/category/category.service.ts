import { PrismaService } from './../prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  public async findAll(): Promise<Category[]> {
    return await this.prisma.category.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
