import { CategoryId } from 'src/product/domain/models/category.model';
import { ProductStatus } from 'src/product/domain/models/product.model';

export const SortFields = {
  NAME: 'name',
  PRICE: 'price',
  CODE: 'code',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
} as const;
type SortField = (typeof SortFields)[keyof typeof SortFields];

export const SortOrders = {
  ASC: 'asc',
  DESC: 'desc',
} as const;
type SortOrder = (typeof SortOrders)[keyof typeof SortOrders];

export class ListProductQuery {
  constructor(
    readonly categoryId?: CategoryId,
    readonly status?: ProductStatus,
    readonly keyword?: string,
    readonly page?: number,
    readonly limit?: number,
    readonly sort?: {
      field: SortField;
      order: SortOrder;
    },
  ) {
    if (page !== undefined && page < 1) {
      throw new Error('페이지 번호는 1 이상이어야 합니다');
    }
    if (limit !== undefined && limit < 1) {
      throw new Error('페이지당 항목 수는 1 이상이어야 합니다');
    }
    if (keyword !== undefined && keyword.length > 50) {
      throw new Error('키워드는 50자 이하여야 합니다');
    }
  }
}
