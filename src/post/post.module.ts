import { PrismaService } from './../prisma.service';
import { PostController } from './post.controller';
import { Module } from '@nestjs/common';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostService, PrismaService],
})
export class PostModule {}
