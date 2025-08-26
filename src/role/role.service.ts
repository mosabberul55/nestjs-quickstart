import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './entities/role.entity';
import { User } from '../user/entities/user.entity';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private RoleModel: Model<Role>,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = await this.RoleModel.findOne({ name: createRoleDto.name });
    if (role) {
      throw new BadRequestException('Role already exist');
    }
    return this.RoleModel.create(createRoleDto);
  }

  async findAll() {
    return this.RoleModel.find().populate('users');
  }

  async findOne(id: string) {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }
    const role = await this.RoleModel.findById(id).populate('users');
    if (!role) {
      throw new BadRequestException('Role not found.');
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct id.');
    }
    const role = await this.RoleModel.findByIdAndUpdate(id, updateRoleDto, {
      new: true,
      runValidators: true,
    });
    if (!role) {
      throw new BadRequestException('Role not found.');
    }
    return role;
  }

  async remove(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException('Please enter correct id.');
    }
    const role = await this.RoleModel.findByIdAndDelete(id);
    if (!role) {
      throw new BadRequestException('Role not found.');
    }
    return { message: 'Role deleted successfully' };
  }

  async assignRole(assignRoleDto: AssignRoleDto) {
    const { users, role } = assignRoleDto;
    const usersExist = await this.userModel.find({ _id: { $in: users } });
    if (usersExist.length !== users.length) {
      throw new BadRequestException('Invalid user id');
    }
    const isValidId = mongoose.isValidObjectId(role);
    if (!isValidId) {
      throw new BadRequestException('Invalid role id');
    }
    const roleExists = await this.RoleModel.findById(role);
    if (!roleExists) {
      throw new BadRequestException('Role not found');
    }
    for (const user of users) {
      //delete cache
      await this.cacheManager.del(`user-permissions:${user}`);
      await this.userModel.findByIdAndUpdate(user, {
        $addToSet: { roles: role },
        strict: false,
      });
    }
    return 'Roles assigned successfully';
  }

  async removeRole(removeRoleDto: AssignRoleDto) {
    const { users, role } = removeRoleDto;
    const usersExist = await this.userModel.find({ _id: { $in: users } });
    if (usersExist.length !== users.length) {
      throw new BadRequestException('Invalid user id');
    }
    const isValidId = mongoose.isValidObjectId(role);
    if (!isValidId) {
      throw new BadRequestException('Invalid role id');
    }
    const roleExists = await this.RoleModel.findById(role);
    if (!roleExists) {
      throw new BadRequestException('Role not found');
    }
    for (const user of users) {
      //delete cache
      await this.cacheManager.del(`user-permissions:${user}`);
      await this.userModel.findByIdAndUpdate(user, {
        $pull: { roles: role },
        strict: false,
      });
    }
    return 'Roles removed successfully';
  }
}
