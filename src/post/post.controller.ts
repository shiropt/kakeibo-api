import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Post as PostModel, Prisma } from '@prisma/client';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':id')
  async getPost(@Param('id') id: string): Promise<PostModel | null> {
    return this.postService.getPost(parseInt(id, 10));
  }

  @Get()
  async getPosts(): Promise<PostModel[] | null> {
    return this.postService.getPosts();
  }

  @Post()
  async createPost(@Body() post: Prisma.PostCreateInput): Promise<PostModel> {
    return this.postService.createPost(post);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.deletePost(parseInt(id, 10));
  }
}
