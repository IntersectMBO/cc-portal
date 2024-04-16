import { Injectable } from '@nestjs/common';
import { Change, diffWords } from 'diff';

@Injectable()
export class ConstitutionService {
  constructor() {}

  diffConstitutions(currentFile: string, oldFile: string): Change[] {
    const diff = diffWords(currentFile, oldFile);
    return diff;
  }
}
