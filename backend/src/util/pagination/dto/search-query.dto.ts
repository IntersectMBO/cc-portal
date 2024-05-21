import { PageOptionsDto } from 'src/util/pagination/dto/page-options.dto';
import { SortOrder } from 'src/util/pagination/enums/sort-order.enum';

export class SearchQueryDto {
  searchPhrase: string;
  pageOptions: PageOptionsDto;

  constructor(
    searchPhrase: string,
    page: number,
    perPage: number,
    sortOrder: SortOrder,
  ) {
    this.searchPhrase = searchPhrase;

    this.pageOptions = new PageOptionsDto();
    this.pageOptions.page = page;
    this.pageOptions.perPage = perPage;
    this.pageOptions.order = sortOrder;
  }
  getSearchPhrase(): string {
    return this.searchPhrase;
  }
}
