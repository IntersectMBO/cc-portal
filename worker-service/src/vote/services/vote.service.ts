import { Injectable } from '@nestjs/common';
import {
  InjectDataSource,
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm';
import { Vote } from '../entities/vote.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote, process.env.BE_CONNECTION_NAME)
    private readonly voteRepository: Repository<Vote>,
    @InjectDataSource(process.env.DB_SYNC_CONNECTION_NAME)
    private readonly dbSyncDataSource: DataSource,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  // async create(data: SyncVotesTableDto[]): Promise<Vote[]> {
  //   const votes = this.voteRepository.create(data);
  //   return await this.voteRepository.save(votes);
  // }

  // async getVotesData(): Promise<SyncVotesTableDto[]> {
  //   const queryRunner = this.dbSyncDataSource.createQueryRunner();
  //   await queryRunner.connect();

  //   const filePath = path.join(__dirname, '../sql', 'moj-get-votes-test.sql');
  //   const sql = fs.readFileSync(filePath, 'utf-8');
  //   const result: SyncVotesTableDto[] = await queryRunner.manager.query(sql);
  //   console.log(result);
  //   await queryRunner.release();
  //   // console.log(result);
  //   return result;
  // }
}
