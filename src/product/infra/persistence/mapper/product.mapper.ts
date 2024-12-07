import {
  Product,
  ProductCode,
  ProductId,
} from 'src/product/domain/models/product.model';
import { ProductEntity } from '../product.entity';
import { Price } from 'src/product/domain/values/price.vo';
import { Money } from 'src/common/value/money.vo';
import { CategoryMapper } from './category.mapper';

export const toDomain = (entity: ProductEntity): Product => {
  return new Product({
    id: entity.id as ProductId,
    code: entity.code as ProductCode,
    name: entity.name,
    price: Price.of(Money.of(entity.priceWithoutTax)),
    unit: entity.unit,
    capacity: entity.capacity,
    specification: entity.specification,
    description: entity.description,
    isRecoverable: entity.isRecoverable,
    status: entity.status,
    categories: entity.categories.map((categoryEntity) =>
      CategoryMapper.toDomain(categoryEntity),
    ),
  });
};

export const toEntity = (domain: Product): ProductEntity => {
  const entity = new ProductEntity();
  entity.id = domain.id;
  entity.code = domain.code;
  entity.name = domain.name;
  entity.priceWithoutTax = domain.price.withoutTax.amount;
  entity.priceWithTax = domain.price.withTax.amount;
  entity.unit = domain.unit;
  entity.capacity = domain.capacity;
  entity.specification = domain.specification;
  entity.description = domain.description;
  entity.isRecoverable = domain.isRecoverable;
  entity.status = domain.status;
  entity.categories = domain.categories.map((category) =>
    CategoryMapper.toEntity(category),
  );
  return entity;
};
