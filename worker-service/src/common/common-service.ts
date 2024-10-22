import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { CONNECTION_NAME_DB_SYNC } from './constants/sql.constants';
import { InjectDataSource } from '@nestjs/typeorm';
import axios from 'axios';
import { GovActionProposalDto } from '../governance/dto/gov-action-proposal.dto';

export abstract class CommonService {
  protected logger = new Logger(CommonService.name);

  constructor(
    @InjectDataSource(CONNECTION_NAME_DB_SYNC)
    protected dataSource: DataSource,
  ) {}

  async getPaginatedDataFromSqlFile(
    filePath: string,
    perPage: number,
    offset: number,
  ): Promise<object[]> {
    const fullPath = path.resolve(__dirname, filePath);
    let query = fs.readFileSync(fullPath, 'utf-8');
    query = query.replace(':limit', perPage.toString());
    query = query.replace(':offset', offset.toString());
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    let result: object[];
    try {
      await queryRunner.startTransaction();
      result = await queryRunner.manager.query(query);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      return result;
    }
  }

  async getDataFromSqlFile(
    filePath: string,
    whereInArray: string[],
  ): Promise<object[]> {
    const fullPath = path.resolve(__dirname, filePath);
    let query = fs.readFileSync(fullPath, 'utf-8');
    const placeholders = whereInArray
      .map((_, index) => `$${index + 1}`)
      .join(', ');
    query = query.replace(':whereInArray', placeholders);

    const queryRunner = this.dataSource.createQueryRunner();
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

  async getDataFromSqlFileByPath(filePath: string): Promise<object[]> {
    const fullPath = path.resolve(__dirname, filePath);
    const query = fs.readFileSync(fullPath, 'utf-8');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    let result: object[];
    try {
      await queryRunner.startTransaction();
      result = await queryRunner.manager.query(query);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      return result;
    }
  }

  /**
   * The response data structure example is located on this link:
   *  https://github.com/cardano-foundation/CIPs/blob/master/CIP-0108/examples/no-confidence.jsonld
   **/
  async getGovActionProposalFromUrl(
    url: string,
  ): Promise<Partial<GovActionProposalDto>> {
    try {
      const response = await axios.get(url);
      const jsonData = response.data;
      const title = jsonData.body?.title;
      const abstract = jsonData.body?.abstract;
      const govActionProposal: Partial<GovActionProposalDto> = {
        title: title,
        abstract: abstract,
        govMetadataUrl: url,
      };
      return govActionProposal;
    } catch (e) {
      this.logger.warn(
        `Error when fetching GAP metadata from url ${url}; Message: ${e}`,
      );
      return null;
    }
  }

  async transformIpfsUrl(ipfsUrl: string): Promise<string> {
    if (ipfsUrl && ipfsUrl.startsWith('ipfs://')) {
      const cid = ipfsUrl.replace('ipfs://', '');
      return `https://ipfs.io/ipfs/${cid}`;
    }
    return ipfsUrl; // Return the original URL if it doesn't start with ipfs://
  }
}
