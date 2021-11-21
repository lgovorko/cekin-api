import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeRepository } from './codes.repository';
import { CustomCodesDTO } from './dto';

@Injectable()
export class CodesService {
  constructor(
    @InjectRepository(CodeRepository)
    private readonly codeRepository: CodeRepository,
  ) {}

  public async getUsedCodesGroups(): Promise<any> {
    return this.codeRepository.getUsedCodesGroups({
      from: '2020-01-01',
      to: '2020-12-31',
    });
  }
}
