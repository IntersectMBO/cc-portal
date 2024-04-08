import { Injectable, PipeTransform } from '@nestjs/common';
import { camelizeKeys } from 'humps';

@Injectable()
export class CamelCasePipe implements PipeTransform {
  transform(value: any): any {
    if (typeof value === 'object' && value !== null) {
      return camelizeKeys(value);
    }
    return value;
  }
}
