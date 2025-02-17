import { ProductStatus } from 'src/product/domain/models/product.model';

export interface ProductDTO {
  id: string;
  code: string;
  name: string;

  priceWithoutTax: number;
  priceWithTax: number;

  unit?: string;
  capacity?: string;
  specification?: string;
  description?: string;

  isRecoverable: boolean;
  status: ProductStatus;

  categories: ProductCategoryDTO[];
}

export interface ProductCategoryDTO {
  id: string;
  name: string;
  parentId?: string;
}

export interface ProductSummaryDTO {
  id: string;
  code: string;
  name: string;
  priceWithTax: number;
  isRecoverable: boolean;
  status: ProductStatus;
  mainCategory: string;
}
