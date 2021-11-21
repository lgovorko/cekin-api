import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admins.entity';
import { AdminRepository } from './admins.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, AdminRepository])],
  providers: [AdminsService],
  controllers: [AdminsController],
})
export class AdminsModule {}
