import { Injectable } from '@nestjs/common';
import { RedisHelperService } from '../redis-helpers.service';

@Injectable()
export class RedisInvalidCodeLockService {
  constructor(private readonly redisHelperService: RedisHelperService) {}

  public async checkInvalidCodeEntryLimit(
    userId: number,
    {
      invalidCodeEntryLimit,
      invalidCodeEntryInterval,
      invalidCodeEntryLockInterval,
    }: {
      invalidCodeEntryLimit: number;
      invalidCodeEntryInterval: number;
      invalidCodeEntryLockInterval: number;
    },
  ) {
    const key = `INVALID-CODE-ENTRY-${userId}`;
    const keyLock = `LOCK-CODE-ENTRY-${userId}`;

    const userInvalidCodeEntryCount: string = await this.redisHelperService.get(
      key,
    );

    if (userInvalidCodeEntryCount === null) {
      const newValue = await this.redisHelperService.setInvalidCodeEntry(
        key,
        '1',
        invalidCodeEntryInterval,
      );

      return newValue;
    }

    const incrementedValue: number = await this.redisHelperService.incrementInvalidCoudeEntryCount(
      key,
    );

    if (incrementedValue >= invalidCodeEntryLimit) {
      await this.redisHelperService.setInvalidCodeEntry(
        keyLock,
        '1',
        invalidCodeEntryLockInterval,
      );

      await this.redisHelperService.del(key);
    }
  }

  private incremenetUserInvalidCodeEntry(count: number): number {
    let countToIncrement = count;
    countToIncrement += 1;
    return countToIncrement;
  }
}
