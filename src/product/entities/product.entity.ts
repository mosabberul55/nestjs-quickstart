import mongoose, { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Factory } from 'nestjs-seeder';
import { DiscountTypeEnum } from '../enums/discount-type.enum';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Product extends Document {
  @Factory((faker) => faker?.commerce?.productName?.() ?? '')
  @Prop({ required: true, type: String })
  title: string;

  @Factory((faker) => faker?.lorem?.slug?.() ?? '')
  @Prop({ required: true, unique: true, type: String })
  slug: string;

  @Factory((faker) => faker?.commerce?.productAdjective?.() ?? '')
  @Prop({ required: false, default: null, type: String })
  subtitle?: string;

  @Prop({ required: false, default: 0 })
  price?: number;

  @Prop({ required: false, default: null })
  discountTill?: Date;

  @Prop({ required: false, default: 0 })
  discount?: number;

  @Prop({ required: false, default: null, enum: DiscountTypeEnum })
  discountType?: DiscountTypeEnum;

  @Prop({ required: false, default: null })
  image?: string;

  @Prop({ required: false, default: null })
  images?: string[];

  @Prop({ required: false, default: null })
  pdf?: string;

  @Prop({ required: false, default: 0, type: Number })
  stock?: number;

  @Prop({ required: false, default: false, type: Boolean })
  active: boolean;

  @Prop({ required: false, default: false, type: Boolean })
  featured: boolean;

  @Prop({ required: false, default: 99999, type: Number })
  order?: number;

  @Factory((faker) => faker?.commerce?.productDescription?.() ?? '')
  @Prop({ required: false, default: null, type: String })
  summary?: string;

  @Factory((faker) => faker?.commerce?.productDescription?.() ?? '')
  @Prop({ required: false, default: null, type: String })
  description?: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    default: [],
  })
  categories: Types.Array<Types.ObjectId>;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }],
    default: [],
  })
  authors: Types.Array<Types.ObjectId>;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Publication' }],
    default: [],
  })
  publications: Types.Array<Types.ObjectId>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ title: 1 });
ProductSchema.index({ slug: 1 });
