export class SearchQueryDto {
  searchPhrase: string;

  constructor(searchPhrase: string) {
    this.searchPhrase = searchPhrase;
  }
  getSearchPhrase(): string {
    return this.searchPhrase;
  }
}
