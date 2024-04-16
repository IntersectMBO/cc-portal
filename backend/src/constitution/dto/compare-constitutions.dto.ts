export class CompareConstitutionsDto {
  base: string;
  target: string;

  constructor(base: string, target: string) {
    this.base = base;
    this.target = target;
  }
}
