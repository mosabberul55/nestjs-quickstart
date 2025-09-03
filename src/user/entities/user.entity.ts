import mongoose, { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Factory } from 'nestjs-seeder';
import { UserTypeEnum } from '../enums/user-type.enum';
import { Role } from '../../role/entities/role.entity';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User extends Document {
  @Factory((faker) => faker?.person?.fullName?.() ?? '')
  @Prop({ required: true, type: String })
  name: string;

  @Factory((faker) => faker?.phone?.number?.() ?? '')
  @Prop({ required: true, unique: true, type: String })
  phone: string;

  @Factory(() => '123456')
  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: false, default: null, type: Date })
  phoneVerifiedAt?: Date;

  @Prop({ required: false, default: null })
  avatar?: string;

  @Prop({ required: false, default: false, type: Boolean })
  isSuperAdmin?: boolean;

  @Prop({ required: false, default: null })
  fcmToken?: string;

  @Prop({ required: true, default: UserTypeEnum.USER })
  type: UserTypeEnum;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
    default: [],
  })
  roles: Role[] | Types.ObjectId[];
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(aggregatePaginate);
