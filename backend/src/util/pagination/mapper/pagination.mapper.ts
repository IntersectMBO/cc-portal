import { Paginated } from 'nestjs-paginate';
import { PaginatedDto } from '../dto/paginated.dto';
import { PageOptionsDto } from '../dto/page-options.dto';
import { PaginatedResponse } from '../response/paginated.response';
import { PageMetaResponse } from '../response/page-meta.response';

export class PaginationEntityMapper<E, D> {
  paginatedToDto(paginated: Paginated<E>, mapperFunc: any): PaginatedDto<D> {
    const paginatedDto = new PaginatedDto<D>();
    paginatedDto.items = paginated.data.map((item) => mapperFunc(item));
    paginatedDto.itemCount = paginated.meta.totalItems;

    const pageOptions = new PageOptionsDto();
    pageOptions.page = paginated.meta.currentPage;
    pageOptions.perPage = paginated.meta.itemsPerPage;
    paginatedDto.pageOptions = pageOptions;

    return paginatedDto;
  }
}

export class PaginationDtoMapper<D, R> {
  dtoToResponse(
    paginatedDto: PaginatedDto<D>,
    mapperFunc: any,
  ): PaginatedResponse<R> {
    const pageOptions = paginatedDto.pageOptions;
    const itemCount = paginatedDto.itemCount;
    const pageMetaResponse = new PageMetaResponse(pageOptions, itemCount);
    const itemResponse = paginatedDto.items.map((item) => mapperFunc(item));
    return new PaginatedResponse(itemResponse, pageMetaResponse);
  }
}
