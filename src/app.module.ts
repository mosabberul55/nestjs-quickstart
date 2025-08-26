import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { SettingModule } from './setting/setting.module';
import { HttpModule } from '@nestjs/axios';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PublicationModule } from './publication/publication.module';
import { AuthorModule } from './author/author.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('database.db_uri'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.secret'),
      }),
      global: true,
      inject: [ConfigService],
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      ttl: 30 * 60 * 1000, // 30 minutes in milliseconds
    }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: 1000,
        removeOnFail: 3000,
        backoff: 5000,
      },
    }),
    HttpModule.register({
      global: true,
      timeout: 10000,
      maxRedirects: 3,
    }),
    EventEmitterModule.forRoot(),
    UserModule,
    UserModule,
    AuthModule,
    RoleModule,
    PermissionModule,
    SettingModule,
    PublicationModule,
    AuthorModule,
    CategoryModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
