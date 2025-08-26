import mongoose, { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Factory } from 'nestjs-seeder';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Category extends Document {
  @Factory((faker) => faker?.commerce?.department?.() ?? '')
  @Prop({ required: true, type: String })
  name: string;

  @Factory((faker) => faker?.lorem?.slug?.() ?? '')
  @Prop({ required: true, unique: true, type: String })
  slug: string;

  @Factory((faker) => faker?.lorem?.paragraph?.() ?? '')
  @Prop({ required: false, default: null })
  description: string;

  @Prop({ required: false, default: null })
  image?: string;

  @Prop({ required: false, default: false, type: Boolean })
  active: boolean;

  @Prop({ required: false, default: false, type: Boolean })
  featured: boolean;

  @Prop({ required: false, default: 99999, type: Number })
  order?: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  })
  category?: Category | Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
// CategorySchema.index({ name: 1 });
CategorySchema.virtual('subCategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'category',
});
