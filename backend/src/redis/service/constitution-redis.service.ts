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

  /**
   * This function saves a consitution file within Redis, by default it also sets saved constitution file as a current constitution
   * @param constitution constitution document that is to be cached
   * @param current default set to true, pass false as a parameter if saved constitution file is not a current consititution
   */
  async saveConstitutionFile(
    constitution: ConstitutionDto,
    current: boolean = true,
  ): Promise<void> {
    const constitutionJson = JSON.stringify(constitution);

    if (current) {
      await this.redisRepository.set(
        Constants.PREFIX_CONSTITUTION,
        Constants.SUFFIX_CURRENT_CONSTITUTION,
        constitutionJson,
      );
    }

    await this.redisRepository.set(
      Constants.PREFIX_CONSTITUTION,
      constitution.cid,
      constitutionJson,
    );
  }

  async getConstitutionFileCurrent(): Promise<ConstitutionDto | null> {
    const constitution = await this.redisRepository.get(
      Constants.PREFIX_CONSTITUTION,
      Constants.SUFFIX_CURRENT_CONSTITUTION,
    );
    return JSON.parse(constitution);
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
