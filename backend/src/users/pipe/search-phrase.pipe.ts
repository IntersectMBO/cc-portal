import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SearchPhrasePipe implements PipeTransform {
  transform(value: any) {
    if (!value) {
      return;
    }
    if ((value as string).includes('*') || (value as string).includes(';')) {
      throw new BadRequestException(
        'Search phrase contains illegal characters',
      );
    }
    return value;
  }
}
