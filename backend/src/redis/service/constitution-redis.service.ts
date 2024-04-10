import { Inject, Injectable } from '@nestjs/common';

import { Constants } from '../util/constants';
import { RedisRepository } from '../repository/redis.repo';
import { ConstitutionDto } from '../dto/constitution.dto';

@Injectable()
export class ConstitutionRedisService {
  constructor(
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
  ) {}

  async getConstitutionFile(): Promise<ConstitutionDto | null> {
    const constitution = await this.redisRepository.get(
      Constants.PREFIX_CONSTITUTION,
      Constants.SUFFIX_CURRENT_CONSTITUTION,
    );
    return JSON.parse(constitution);
  }

  async saveConstitutionFile(constitution: ConstitutionDto): Promise<void> {
    await this.redisRepository.set(
      Constants.PREFIX_CONSTITUTION,
      Constants.SUFFIX_CURRENT_CONSTITUTION,
      JSON.stringify(constitution),
    );
  }
}
