import { PaginatedResponse, Pagination } from '../types/pagination';

export function createPagination<T>(
  items: T[],
  pagination: Pagination,
): PaginatedResponse<T> {
  const { page, limit, total } = pagination;
  const validatedPage = validatePage(page, limit, total);
  const validatedLimit = validateLimit(limit);
  const validatedTotal = validateTotal(total);
  const totalPages = Math.ceil(validatedTotal / validatedLimit);
  const hasPrev = validatedPage > 1;
  const hasNext = validatedPage < totalPages;

  return {
    items,
    pagination: {
      page: validatedPage,
      limit: validatedLimit,
      total: validatedTotal,
      totalPages,
      hasPrev,
      hasNext,
    },
  };
}

export function calcSkip(page: number, limit: number): number {
  if (page <= 0) throw new Error('페이지 번호는 1 이상이어야 합니다');
  const validatedLimit = validateLimit(limit);
  return (page - 1) * validatedLimit;
}

export function calcTotalPage(total: number, limit: number): number {
  const validatedTotal = validateTotal(total);
  const validatedLimit = validateLimit(limit);
  return Math.ceil(validatedTotal / validatedLimit);
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

function validateLimit(limit: number): number {
  if (limit < 1) throw new Error('한 페이지당 항목 수는 1 이상이어야 합니다');
  return limit;
}

function validateTotal(total: number): number {
  if (total < 0) throw new Error('총 항목 수는 0 이상이어야 합니다');
  return total;
}
