import { Injectable } from '@nestjs/common';
import { Change, diffSentences } from 'diff';

@Injectable()
export class ConstitutionService {
  constructor() {}

  diffConstitutions(currentFile: string, oldFile: string): Change[] {
    const diff = diffSentences(currentFile, oldFile);
    return diff;
  }
}
