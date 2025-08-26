import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
  ) {}
  create(createPermissionDto: CreatePermissionDto) {
    return 'This action adds a new permission';
  }

  async findAll() {
    return await this.permissionModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
