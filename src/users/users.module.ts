import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { UserHelperService } from './services';
import { JwtModule } from '@nestjs/jwt';
import { HelperService } from '../shared/services';
import { RedisHelperModule } from '../redis-helpers/redis-helpers.module';
import { UserRepository } from './users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRepository]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    RedisHelperModule,
  ],
  providers: [UsersService, UserHelperService, HelperService],
  controllers: [UsersController],
  exports: [UserHelperService],
})
export class UsersModule {}
