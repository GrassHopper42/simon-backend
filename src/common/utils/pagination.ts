import { PaginatedResponse, Pagination } from '../types/pagination';

export function createPagination<T>(
  items: T[],
  pagination: Pagination,
): PaginatedResponse<T> {
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

export function calcSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function calcTotalPage(total: number, limit: number): number {
  return Math.ceil(total / limit);
}

export function validatePage(
  page: number,
  limit: number,
  total: number,
): number {
  const totalPages = this.calcTotalPage(total, limit);
  if (page < 1) return 1;
  if (page > totalPages) return totalPages;
  return page;
}
