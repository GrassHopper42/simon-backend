import { CategoryId } from 'src/product/domain/models/category.model';
import { ProductStatus } from 'src/product/domain/models/product.model';

export class ListProductQuery {
  constructor(
    readonly categoryId?: CategoryId,
    readonly status?: ProductStatus,
    readonly keyword?: string,
    readonly page?: number,
    readonly limit?: number,
    readonly sort?: {
      field: 'name' | 'price' | 'code' | 'createdAt' | 'updatedAt';
      order: 'asc' | 'desc';
    },
  ) {}
}
