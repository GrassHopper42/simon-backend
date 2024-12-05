import { PaginatedResponse, Pagination } from '../types/pagination';

export class PaginationFactory {
  static create<T>(items: T[], pagination: Pagination): PaginatedResponse<T> {
    const { page, limit, total } = pagination;
    const totalPages = Math.ceil(total / limit);
    const hasPrev = page > 1;
    const hasNext = page < totalPages;

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasPrev,
        hasNext,
      },
    };
  }

  static calcSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static calcTotalPage(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }

  static validatePage(page: number, limit: number, total: number): number {
    const totalPages = this.calcTotalPage(total, limit);
    if (page < 1) return 1;
    if (page > totalPages) return totalPages;
    return page;
  }
}
