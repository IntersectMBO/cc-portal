export class CompareConstitutionsDto {
  olderVersion: string;
  currentVersion: string;

  constructor(olderVersion: string, currentVersion: string) {
    this.olderVersion = olderVersion;
    this.currentVersion = currentVersion;
  }
}
