import { CategoryId } from '../models/category.model';
import { Product, ProductId, ProductStatus } from '../models/product.model';

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';

export interface ProductRepository {
  // 단건 조회
  findById(id: ProductId): Promise<Product | null>;
  findByCode(code: string): Promise<Product | null>;

  // 목록 조회
  findMany(filter: ProductFilter, options: FindOptions): Promise<Product[]>;
  findAllByCategories(categoryIds: CategoryId[]): Promise<Product[]>;

  // 카운트 조회
  count(filter: ProductFilter): Promise<number>;
  countByCategory(categoryId: CategoryId): Promise<number>;
  countByCategories(categoryIds: CategoryId[]): Promise<number>;

  // 저장, 수정, 삭제
  save(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  delete(product: Product): Promise<void>;
}

export interface ProductFilter {
  categoryId?: string;
  status?: ProductStatus;
  keyword?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  isRecoverable?: boolean;
}

export interface FindOptions {
  skip?: number;
  limit?: number;
  sort?: {
    field: 'name' | 'price' | 'code' | 'createdAt' | 'updatedAt';
    order: 'asc' | 'desc';
  };
}
