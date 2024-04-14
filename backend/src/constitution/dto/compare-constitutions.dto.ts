export class CompareConstitutionsDto {
  currentVersionCID: string;
  oldVersionCID: string;

  constructor(currentVersionCID: string, oldVersionCID: string) {
    this.currentVersionCID = currentVersionCID;
    this.oldVersionCID = oldVersionCID;
  }
}
