import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { AuthGuard } from '../guards/auth.guard';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { Resource } from './enums/resource.enum';
import { Action } from './enums/action.enum';
import { Permissions } from '../decorators/permissions.decorator';

@UseGuards(AuthGuard, AuthorizationGuard)
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Permissions([{ resource: Resource.PERMISSION, actions: [Action.CREATE] }])
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Permissions([{ resource: Resource.PERMISSION, actions: [Action.READ] }])
  @Get()
  findAll() {
    return this.permissionService.findAll();
  }
  @Permissions([{ resource: Resource.PERMISSION, actions: [Action.READ] }])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(+id);
  }
  @Permissions([{ resource: Resource.PERMISSION, actions: [Action.UPDATE] }])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionService.update(+id, updatePermissionDto);
  }
  @Permissions([{ resource: Resource.PERMISSION, actions: [Action.DELETE] }])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionService.remove(+id);
  }
}
