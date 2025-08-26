import { seeder } from 'nestjs-seeder';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { User, UserSchema } from './user/entities/user.entity';
import { UserSeeder } from './user/seeder/user.seeder';
import { Permission, PermissionSchema } from './permission/entities/permission.entity';
import { Role, RoleSchema } from './role/entities/role.entity';
import { PermissionSeeder } from './permission/seeder/permission.seed';

dotenv.config();
seeder({
  imports: [
    MongooseModule.forRoot(
      process.env.DB_URI ?? 'mongodb://localhost:27017/otalms',
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
}).run([UserSeeder, PermissionSeeder]);
