import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Resource } from '../enums/resource.enum';
import { Action } from '../enums/action.enum';

@Schema({ timestamps: true })
export class Permission {
  @Prop({ required: true, enum: Resource })
  resource: Resource;

  @Prop({ type: [{ type: String, enum: Action }] })
  actions: string[];
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
