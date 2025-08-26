import { Seeder } from 'nestjs-seeder';
import { Injectable } from '@nestjs/common';
import { Permission } from '../entities/permission.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Resource } from '../enums/resource.enum';
import { Action } from '../enums/action.enum';
import { Role } from '../../role/entities/role.entity';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class PermissionSeeder implements Seeder {
  constructor(
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async seed() {
    const resources: Resource[] = Object.values(Resource);
    const actions: Action[] = Object.values(Action);

    const permissions = resources.map((resource) => {
      return {
        resource,
        actions,
      };
    });

    //insert permissions. if permissions already exist, it will not insert into the database
    await this.permissionModel.insertMany(permissions, { ordered: false });
    //create default roles with all permissions
    const superAdminRole = {
      name: 'Super Admin',
      permissions: permissions.map((permission) => ({
        resource: permission.resource,
        actions: permission.actions,
      })),
    };
    const agentRole = {
      name: 'User',
      permissions: permissions.map((permission) => ({
        resource: permission.resource,
        actions: permission.actions.filter(
          (action) => action !== Action.CREATE && action !== Action.UPDATE,
        ), // User cannot create or update
      })),
    };
    //insert roles into the database
    await this.roleModel.insertMany([superAdminRole, agentRole], {
      ordered: false,
    });
    //get the super admin role from the database
    const superAdminRoleDoc = await this.roleModel.findOne({
      name: 'Super Admin',
    });
    //assign super admin role to the user in the database where isSuperAdmin is true
    const superAdminUser = await this.userModel.findOne({
      isSuperAdmin: true,
    });
    if (superAdminUser) {
      if (superAdminRoleDoc?._id) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        superAdminUser.roles.push(superAdminRoleDoc._id as any);
      }
      await superAdminUser.save();
    }
  }

  async drop() {
    await this.permissionModel.deleteMany({});
    await this.roleModel.deleteMany({});
    await this.userModel.updateMany(
      { isSuperAdmin: true },
      { $set: { roles: [] } },
    );
  }
}
