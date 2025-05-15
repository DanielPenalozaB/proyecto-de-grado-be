import { FindOptionsOrder, FindOptionsWhere, Like, Repository, ObjectLiteral } from 'typeorm';
import { BasePaginationDto } from '../dto/base-pagination.dto';

export class PaginationService<T extends ObjectLiteral> {
  async paginate(
    repository: Repository<T>,
    paginationDto: BasePaginationDto,
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[] = {},
    order: FindOptionsOrder<T> = {},
    defaultSortField: keyof T & string = 'createdAt' as keyof T & string
  ) {
    const { page, limit, sortDirection } = paginationDto;

    // Apply default sorting if no order provided
    if (Object.keys(order).length === 0) {
      (order as any)[defaultSortField] = sortDirection;
    }

    const [items, total] = await repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order,
    });

    return {
      data: items,
      meta: {
        pagination: {
          page,
          limit,
          pageCount: Math.ceil(total / limit),
          total,
          hasNextPage: page * limit < total,
          hasPreviousPage: page > 1,
        },
      },
    };
  }
}