import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CONNECTION_NAME_DB_SYNC } from '../../common/constants';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VoteService {
  constructor(
    @InjectDataSource(CONNECTION_NAME_DB_SYNC)
    private readonly dataSource: DataSource,
  ) {}

  async executeSqlFile(): Promise<void> {
    const filePath = path.join(__dirname, '../sql', 'moj-get-votes-test.sql');
    const sql = fs.readFileSync(filePath, 'utf-8');
    await this.dataSource.query(sql);
  }
}
