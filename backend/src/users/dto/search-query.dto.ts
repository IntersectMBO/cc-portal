export class SearchQueryDto {
  searchPhrase: string;
  sortOrder: SortOrder;

  constructor(searchPhrase: string, sortOrder: SortOrder) {
    this.searchPhrase = searchPhrase;
    this.sortOrder = sortOrder;
  }
  getSearchPhrase(): string {
    return this.searchPhrase;
  }
  getSortOrder(): string {
    return this.sortOrder;
  }
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}
