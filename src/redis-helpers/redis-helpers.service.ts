import { Injectable } from '@nestjs/common';
import * as IO from 'ioredis';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class RedisHelperService {
  private client: IO.Redis;

  constructor(private readonly redisService: RedisService) {
    this.client = this.getClient();
  }

  /*
    String
  */

  public getClient(): IO.Redis {
    return this.redisService.getClient(process.env.REDIS_CLIENT_NAME);
  }

  public set(key: string, value: number[]): Promise<'OK'> {
    return this.client.set(key, `${value}`);
  }

  public setResetPassword(key: string, value: string): Promise<'OK'> {
    return this.client.set(key, `${value}`);
  }

  public setInvalidCodeEntry(
    key: string,
    value: string,
    ttl: number,
  ): Promise<'OK'> {
    return this.client.set(key, `${value}`, 'EX', ttl);
  }

  public incrementInvalidCoudeEntryCount(key: string): Promise<number> {
    return this.client.incr(key);
  }

  public setExpiry(key: string, value: string, ttl: number): Promise<'OK'> {
    return this.client.set(key, value, 'EX', ttl);
  }

  public get(key: string): Promise<string> {
    return this.client.get(key);
  }

  public del(key: string): Promise<number> {
    return this.client.del(key);
  }

  /*
    Hash
  */

  public setHash(
    field: string,
    key: string,
    value: string,
  ): Promise<any> {
    return this.client.hset(field, key, value);
  }

  public getHash(field: string, key: string): Promise<string> {
    return this.client.hget(field, key);
  }

  public delHash(field: string, key: string): Promise<number> {
    return this.client.hdel(field, key);
  }

  /*
    Helper functions
  */

  public async getArrayOfNumbers(key: string): Promise<number[]> {
    const array = await this.get(key);
    if (array === null) return null;
    return array.split(',').map(currentValue => +currentValue);
  }

  public removeValueFromArray(value: number, array: number[]): number[] {
    if (array === null) return [];
    const arrayToRemove = array;
    const index = arrayToRemove.indexOf(+value);
    arrayToRemove.splice(index, 1);
    return arrayToRemove;
  }
}
