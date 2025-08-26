import {
  ArrayUnique,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Resource } from '../../permission/enums/resource.enum';
import { Action } from '../../permission/enums/action.enum';
import { Type } from 'class-transformer';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ValidateNested()
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}

export class PermissionDto {
  @IsEnum(Resource)
  resource: Resource;

  @IsEnum(Action, { each: true })
  @ArrayUnique()
  actions: Action[];
}
