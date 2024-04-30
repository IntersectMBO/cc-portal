import { Inject, Injectable } from '@nestjs/common';
import { Constants } from '../util/constants';
import { RedisRepository } from '../repository/redis.repo';
import { ConstitutionDto } from '../dto/constitution.dto';

@Injectable()
export class ConstitutionRedisService {
  constructor(
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
  ) {}

  async saveConstitutionFile(constitution: ConstitutionDto): Promise<void> {
    const constitutionJson = JSON.stringify(constitution);

    await this.redisRepository.set(
      Constants.PREFIX_CONSTITUTION,
      constitution.cid,
      constitutionJson,
    );
  }

  async getConstitutionFileByCid(cid: string): Promise<ConstitutionDto | null> {
    const constitution = await this.redisRepository.get(
      Constants.PREFIX_CONSTITUTION,
      cid,
    );
    return JSON.parse(constitution);
  }
}
