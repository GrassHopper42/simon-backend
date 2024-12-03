import { Category } from '../models/category.model';

export const CATEGORY_REPOSITORY = 'CATEGORY_REPOSITORY';

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  findAllByIds(ids: number[]): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  findChildren(parentId: number): Promise<Category[]>;
  save(category: Category): Promise<void>;
  update(category: Category): Promise<void>;
  delete(id: number): Promise<void>;
}
