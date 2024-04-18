import { Inject, Injectable } from '@nestjs/common';
import { Constants } from '../util/constants';
import { RedisRepository } from '../repository/redis.repo';
import { ConstitutionDto } from '../dto/constitution.dto';
import { ConstitutionDiffDto } from '../dto/constitution-diff.dto';

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

  async saveConstitutionDiff(diff: ConstitutionDiffDto): Promise<void> {
    await this.redisRepository.set(
      Constants.PREFIX_CONSTITUTION_DIFF,
      this.generateDiffKey(diff.base, diff.target),
      JSON.stringify(diff),
    );
  }

  async getConstitutionDiff(
    base: string,
    target: string,
  ): Promise<ConstitutionDiffDto> {
    const diff = await this.redisRepository.get(
      Constants.PREFIX_CONSTITUTION_DIFF,
      this.generateDiffKey(base, target),
    );
    return JSON.parse(diff);
  }

  private generateDiffKey(base: string, target: string): string {
    return `${base}-${target}`;
  }
}
