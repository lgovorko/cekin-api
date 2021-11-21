import { Module } from '@nestjs/common';
import { UserCodeService } from './user-code.service';
import { UserCodeController } from './user-code.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCode } from './entities/user-code.entity';
import { UserCodeRepository } from './user-code.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserCode, UserCodeRepository])],
  providers: [UserCodeService],
  controllers: [UserCodeController],
})
export class UserCodeModule {}
