import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { errorMessage } from '../shared/error-messages/error-messages';
import { getRepository } from 'typeorm';
import { CodeCheckDTO, UserCodeDTO } from './dto';
import { UserCodeRepository } from './user-code.repository';
import { Code } from '../codes/entities/codes.entity';

@Injectable()
export class UserCodeService {
  constructor(
    @InjectRepository(UserCodeRepository)
    private readonly userCodeRepository: UserCodeRepository,
  ) {}

  public async checkCode(
    codeCheckPayload: CodeCheckDTO,
  ): Promise<UserCodeDTO[]> {
    const { code: codeToCheck } = codeCheckPayload;

    const code = await getRepository(Code).findOne({
      where: { code: codeToCheck },
    });

    if (!code) throw new NotFoundException(errorMessage.codeNotFound);

    return this.userCodeRepository.checkCode(codeCheckPayload);
  }
}
