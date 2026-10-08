import { PaginateConfig } from 'nestjs-paginate';
import { User } from 'src/users/entities/user.entity';

export const USER_PAGINATION_CONFIG: PaginateConfig<User> = {
  sortableColumns: ['name'],
  searchableColumns: ['name', 'email'],
  defaultSortBy: [['name', 'ASC']],
};

// Public member search must not match on contact details.
export const USER_PUBLIC_PAGINATION_CONFIG: PaginateConfig<User> = {
  sortableColumns: ['name'],
  searchableColumns: ['name'],
  defaultSortBy: [['name', 'ASC']],
};
