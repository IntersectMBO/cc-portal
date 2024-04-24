import { Injectable } from '@nestjs/common';
// import { Change, diffSentences } from 'diff';

@Injectable()
export class ConstitutionService {
  constructor() {}

  //Currently, the diff will be rendered by frontend, that's why this code is commented

  // diffConstitutions(currentFile: string, oldFile: string): Change[] {
  //   const diff = diffSentences(currentFile, oldFile);
  //   return diff;
  // }
}
