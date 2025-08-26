import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './entities/category.entity';
import mongoose, { Model } from 'mongoose';
import { Query } from 'express-serve-static-core';
import { generateUniqueSlug, updateSlug } from '../utils/slug.util';
import { validateObjectIdOrThrow } from '../utils/helper';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const slug = await generateUniqueSlug(
      this.categoryModel,
      createCategoryDto.name,
    );
    return await this.categoryModel.create({ ...createCategoryDto, slug });
  }

  async findAll(query: Query) {
    const categoryId = query.category;
    if (categoryId && !mongoose.isValidObjectId(categoryId)) {
      throw new NotFoundException('Invalid category id');
    }
    const filter = categoryId ? { category: categoryId } : { category: null };
    return this.categoryModel.find(filter);
  }

  async findOne(slug: string) {
    const category = await this.categoryModel.findOne({ slug });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(slug: string, updateCategoryDto: UpdateCategoryDto) {
    console.log(updateCategoryDto);
    const category = await this.categoryModel.findOne({ slug });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const slugUpdate = await updateSlug(
      this.categoryModel,
      (category._id as mongoose.Types.ObjectId).toString(),
      updateCategoryDto.name ?? '',
    );
    return this.categoryModel.findByIdAndUpdate(
      category._id,
      { ...updateCategoryDto, slug: slugUpdate },
      { new: true },
    );
  }

  async remove(slug: string) {
    const category = await this.categoryModel.findOne({ slug });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.categoryModel.findByIdAndDelete(category._id);
  }
}
