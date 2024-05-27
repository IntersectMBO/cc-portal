import { PaginateConfig } from 'nestjs-paginate';
import { User } from 'src/users/entities/user.entity';

export const VOTE_PAGINATION_CONFIG: PaginateConfig<User> = {
  sortableColumns: ['name'],
  searchableColumns: ['name'],
  defaultSortBy: [['name', 'DESC']],
};
