import { Product } from '../models/product.model';

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  findByCode(code: string): Promise<Product | null>;
  findAllByCategory(categoryId: number): Promise<Product[]>;

  save(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  delete(id: number): Promise<void>;
}
