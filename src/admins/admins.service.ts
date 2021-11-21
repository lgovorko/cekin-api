import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { pickBy, identity } from 'lodash';
import { hashSync } from 'bcrypt';

import { AdminRepository } from './admins.repository';
import { Admin } from './entities/admins.entity';
import { AdminCreateDTO, AdminDTO, AdminUpdateDTO } from './dto';
import { errorMessage } from '../shared/error-messages/error-messages';

@Injectable()
export class AdminsService extends TypeOrmCrudService<Admin> {
  constructor(
    @InjectRepository(AdminRepository)
    private readonly adminRepository: AdminRepository,
  ) {
    super(adminRepository);
  }

  public async createAdmin(adminPayload: AdminCreateDTO): Promise<AdminDTO> {
    const { password } = adminPayload;

    const adminToCreate = pickBy(
      {
        ...adminPayload,
        password: password && hashSync(password, 10),
      },
      identity,
    );
    const newAdmin = await this.adminRepository.save(adminToCreate);

    return newAdmin;
  }

  public async updateAdmin(
    adminId: number,
    adminPayload: AdminUpdateDTO,
  ): Promise<AdminDTO> {
    const admin = await this.adminRepository.findOne(adminId);
    if (!admin) throw new NotFoundException(errorMessage.adminNotFound);

    const { password } = adminPayload;

    const adminToUpdate = pickBy(
      {
        ...adminPayload,
        password: password && hashSync(password, 10),
      },
      identity,
    );

    const updatedAdmin = await this.adminRepository.save({
      ...admin,
      ...adminToUpdate,
    });
    return updatedAdmin;
  }

  public async deleteAdmin(adminId: number): Promise<AdminDTO> {
    const admin = await this.adminRepository.findOne(adminId);

    if (!admin) throw new NotFoundException(errorMessage.adminNotFound);

    return this.adminRepository.remove(admin);
  }
}
