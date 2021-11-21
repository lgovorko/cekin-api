import { Injectable } from '@nestjs/common';

@Injectable()
export class PrizeHelperService {
  public incrementPrizeSpentCount(spentCount: number): number {
    let spentCountToIncrement: number = spentCount;
    spentCountToIncrement += 1;
    return spentCountToIncrement;
  }

  public decrementPrizeSpentCount(spentCount: number): number {
    let spentCountToIncrement: number = spentCount;
    spentCountToIncrement -= 1;
    return spentCountToIncrement;
  }
}
