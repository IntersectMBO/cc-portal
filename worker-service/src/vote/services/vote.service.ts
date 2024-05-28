import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  InjectDataSource,
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { VoteDto } from '../dto/vote.dto';
import { Vote } from '../entities/vote.entity';
import { VoteMapper } from '../mapper/vote.mapper';
import { VoteRequestDto } from '../dto/vote-request.dto';
import { CONNECTION_NAME_DB_SYNC } from '../../common/constants/sql.constants';

@Injectable()
export class VoteService {
  private logger = new Logger(VoteService.name);

  constructor(
    @InjectDataSource(CONNECTION_NAME_DB_SYNC)
    private readonly dbSyncDataSource: DataSource,
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async storeVotesData(votesData: VoteRequestDto[]): Promise<VoteDto[]> {
    let returnedData;
    try {
      returnedData = await this.entityManager.transaction(async () => {
        const rates = this.voteRepository.create(votesData);
        return await this.voteRepository.upsert(rates, {
          conflictPaths: ['comment'],
          skipUpdateIfNoValuesChanged: true,
        });
      });
    } catch (e) {
      this.logger.error(`Error within transaction: ${e.message}`);
      throw new InternalServerErrorException('Transaction failed');
    }
    console.log(returnedData);
    const resp = VoteMapper.votesToDto(returnedData.raw);
    return resp;
  }

  async getVotesFromSqlFile(
    filePath: string,
    whereInArray: string[],
  ): Promise<object[]> {
    const fullPath = path.resolve(__dirname, filePath);
    let query = fs.readFileSync(fullPath, 'utf-8');
    const placeholders = whereInArray
      .map((_, index) => `$${index + 1}`)
      .join(', ');
    query = query.replace(':whereInArray', placeholders);

    const queryRunner = this.dbSyncDataSource.createQueryRunner();
    await queryRunner.connect();
    let result: object[];
    try {
      await queryRunner.startTransaction();
      result = await queryRunner.manager.query(query, whereInArray);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      return result;
    }
  }
}
