import { Category, CategoryId } from 'src/product/domain/models/category.model';
import { CategoryEntity } from '../category.entity';

export class CategoryMapper {
  static toDomain(entity: CategoryEntity): Category {
    return new Category({
      id: entity.id as CategoryId,
      name: entity.name,
      parentId: entity.parentId as CategoryId,
    });
  }

  static toEntity(domain: Category): CategoryEntity {
    const entity = new CategoryEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.parentId = domain.parentId;
    return entity;
  }
}
