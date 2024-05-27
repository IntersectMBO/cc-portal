import { PageOptionsDto } from './page-options.dto';

export class PaginatedDto<T> {
  items: T[];
  itemCount: number;
  pageOptions: PageOptionsDto;
}
