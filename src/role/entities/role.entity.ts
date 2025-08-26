import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Resource } from '../../permission/enums/resource.enum';
import { Action } from '../../permission/enums/action.enum';

@Schema()
class Permission {
  @Prop({ required: true, enum: Resource })
  resource: Resource;

  @Prop({ type: [{ type: String, enum: Action }] })
  actions: Action[];
}

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Role {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: [Permission] })
  permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'roles',
});
