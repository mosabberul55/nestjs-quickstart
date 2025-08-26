import { ArrayUnique, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class AssignRoleDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayUnique()
  users: Types.ObjectId[];

  @IsNotEmpty()
  @IsString()
  role: Types.ObjectId;
}
