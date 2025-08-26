import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuthGuard } from '../guards/auth.guard';
import { AssignRoleDto } from './dto/assign-role.dto';
import { AuthorizationGuard } from '../guards/authorization.guard';
import { Permissions } from '../decorators/permissions.decorator';
import { Resource } from '../permission/enums/resource.enum';
import { Action } from '../permission/enums/action.enum';

@UseGuards(AuthGuard, AuthorizationGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Permissions([{ resource: Resource.ROLE, actions: [Action.CREATE] }])
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Post('assign')
  assignRole(@Body() assignRoleDto: AssignRoleDto) {
    return this.roleService.assignRole(assignRoleDto);
  }

  @Post('remove')
  removeRole(@Body() removeRoleDto: AssignRoleDto) {
    return this.roleService.removeRole(removeRoleDto);
  }
  @Permissions([{ resource: Resource.ROLE, actions: [Action.READ] }])
  @Get()
  findAll() {
    return this.roleService.findAll();
  }
  @Permissions([{ resource: Resource.ROLE, actions: [Action.READ] }])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }
  @Permissions([{ resource: Resource.ROLE, actions: [Action.UPDATE] }])
  @Put(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }
  @Permissions([{ resource: Resource.ROLE, actions: [Action.DELETE] }])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }
}
