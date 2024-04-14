import { Injectable } from '@nestjs/common';
import { Change, diffWords } from 'diff';

@Injectable()
export class ConstitutionService {
  constructor() {}

  async diffConstitutions(
    currentConstitutionVersionFile: string,
    oldConstitutionVersionFile: string,
  ): Promise<Change[]> {
    const diff = diffWords(
      currentConstitutionVersionFile,
      oldConstitutionVersionFile,
    );
    return diff;
  }
}
