import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly image?: string;

  @IsOptional()
  @IsString()
  readonly category?: mongoose.Schema.Types.ObjectId;
}
