import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { SortOrder } from '../dto/search-query.dto';

@Injectable()
export class SortOrderPipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      return;
    }
    const values = Object.values(SortOrder);

    if (!values.includes(value as string as SortOrder)) {
      throw new BadRequestException('Unknown Sort Order parameter');
    }
    return value;
  }
}
