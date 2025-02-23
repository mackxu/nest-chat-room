import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from './const';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  @Inject(REDIS_CLIENT)
  private readonly redis: Redis;

  async get(key: string) {
    this.redis.get(key);
  }

  async set(key: string, value: string | number, expire?: number) {
    const options: any = {};
    if (expire) {
      options.EX = expire;
    }
    await this.redis.set(key, value, options);
  }
}
