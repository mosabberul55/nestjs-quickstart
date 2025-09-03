import { Injectable } from '@nestjs/common';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserTypeEnum } from '../enums/user-type.enum';

@Injectable()
export class UserSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async seed(): Promise<any> {
    const existingAdmin = await this.userModel.findOne({
      phone: '01500000000',
    });
    if (!existingAdmin) {
      const superAdmin = new this.userModel({
        name: 'Super Admin',
        phone: '01500000000',
        password: await bcrypt.hash('123456', 10),
        isSuperAdmin: true,
        type: UserTypeEnum.ADMIN,
      });
      await superAdmin.save();
    }
    // const users = DataFactory.createForClass(User).generate(50, {
    //   password: async () => await bcrypt.hash('123456', 10),
    // });
    // return this.userModel.insertMany(users);
  }
  async drop(): Promise<any> {
    // Drop the users collection.
    return this.userModel.deleteMany({});
  }
}
