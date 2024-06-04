import { Injectable } from '@nestjs/common';
import {
  PaginateConfig,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class Paginator {
  paginate<T extends ObjectLiteral>(
    query: PaginateQuery,
    repo: Repository<T> | SelectQueryBuilder<T>,
    config: PaginateConfig<T>,
  ): Promise<Paginated<T>> {
    return paginate(query, repo, config);
  }
}
