import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import type { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() query: ExpressQuery) {
    return this.categoryService.findAll(query);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.categoryService.findOne(slug);
  }

  @Put(':slug')
  update(
    @Param('slug') slug: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(slug, updateCategoryDto);
  }

  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.categoryService.remove(slug);
  }
}
