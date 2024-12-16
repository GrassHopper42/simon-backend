import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Product,
  ProductCode,
  ProductId,
} from 'src/product/domain/models/product.model';
import {
  FindOptions,
  ProductFilter,
  ProductRepository,
} from 'src/product/domain/repository/product.repository';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ProductEntity } from '../persistence/product.entity';
import { EventBus } from 'src/common/event/event-bus';
import { CategoryId } from 'src/product/domain/models/category.model';
import { toDomain, toEntity } from '../persistence/mapper/product.mapper';

@Injectable()
export class TypeormProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly eventBus: EventBus,
  ) {}

  async findMany(
    filter: ProductFilter,
    options: FindOptions,
  ): Promise<Product[]> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect(
        'product.categories',
        'categories',
      ) as ProductQueryBuilder;

    queryBuilder
      .addFilterCondition(filter)
      .addSortCondition(options.sort)
      .addPaginationCondition(options.skip, options.limit);

    return queryBuilder
      .getMany()
      .then((entities) => entities.map((entity) => toDomain(entity)));
  }

  async findAllByCategories(categoryIds: CategoryId[]): Promise<Product[]> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categories', 'categories')
      .where('categories.id IN (:categoryIds)', { categoryIds });

    return query
      .getMany()
      .then((entities) => entities.map((entity) => toDomain(entity)));
  }

  async count(filter: ProductFilter): Promise<number> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.categories', 'category') as ProductQueryBuilder;

    queryBuilder.addFilterCondition(filter);

    return queryBuilder.getCount();
  }

  async countByCategory(categoryId: CategoryId): Promise<number> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.categories', 'category')
      .where('category.id = :categoryId', { categoryId });

    return query.getCount();
  }

  async countByCategories(categoryIds: CategoryId[]): Promise<number> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.categories', 'category')
      .where('category.id IN (:categoryIds)', { categoryIds });

    return query.getCount();
  }

  async findById(id: ProductId): Promise<Product | null> {
    const entity = await this.productRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    return entity ? toDomain(entity) : null;
  }

  async findByCode(code: ProductCode): Promise<Product | null> {
    const entity = await this.productRepository.findOne({
      where: { code },
      relations: ['categories'],
    });
    return entity ? toDomain(entity) : null;
  }

  async findAllByCategory(categoryId: CategoryId): Promise<Product[]> {
    const entities = await this.productRepository.find({
      where: {
        categories: {
          id: categoryId,
        },
      },
      relations: ['categories'],
    });
    return entities.map((entity) => toDomain(entity));
  }

  async save(product: Product): Promise<void> {
    const entity = toEntity(product);
    await this.productRepository.insert(entity);

    const events = product.clearEvents();

    for (const event of events) await this.eventBus.publish(event);
  }

  async update(product: Product): Promise<void> {
    const entity = toEntity(product);
    await this.productRepository.update(entity.id, entity);

    const events = product.clearEvents();

    for (const event of events) await this.eventBus.publish(event);
  }

  async delete(product: Product): Promise<void> {
    const events = product.clearEvents();

    for (const event of events) await this.eventBus.publish(event);

    await this.productRepository.softDelete(product.id);
  }
}

class ProductQueryBuilder extends SelectQueryBuilder<ProductEntity> {
  addKeywordCondition(keyword?: string): ProductQueryBuilder {
    if (!keyword) return this;
    return this.andWhere(
      'product.name LIKE :keyword OR product.code LIKE :keyword',
      {
        keyword: `%${keyword}%`,
      },
    );
  }

  addCategoryCondition(categoryId?: string): ProductQueryBuilder {
    if (!categoryId) return this;
    return this.andWhere('category.id = :categoryId', { categoryId });
  }

  addStatusCondition(status?: string): ProductQueryBuilder {
    if (!status) return this;
    return this.andWhere('product.status = :status', { status });
  }

  addPriceRangeCondition(priceRange?: {
    min?: number;
    max?: number;
  }): ProductQueryBuilder {
    if (!priceRange) return this;
    if (priceRange.min) {
      this.andWhere('product.priceWithTax >= :min', {
        min: priceRange.min,
      });
    }

    if (priceRange.max) {
      this.andWhere('product.priceWithTax <= :max', {
        max: priceRange.max,
      });
    }

    return this;
  }

  addIsRecoverableCondition(isRecoverable?: boolean): ProductQueryBuilder {
    if (isRecoverable === undefined) return this;
    return this.andWhere('product.isRecovarable = :isRecovarable', {
      isRecoverable: isRecoverable,
    });
  }

  addSortCondition(sort?: FindOptions['sort']): ProductQueryBuilder {
    if (!sort) return this;
    this.validateSortField(sort.field);
    this.validateSortOrder(sort.order);
    return this.orderBy(
      `product.${sort.field}`,
      sort.order.toUpperCase() as 'ASC' | 'DESC',
    );
  }

  private validateSortField(sortField: string): void {
    const allowedFields = [
      'name',
      'priceWithTax',
      'code',
      'createdAt',
      'updatedAt',
    ];
    if (!allowedFields.includes(sortField)) {
      throw new Error('유효하지 않은 정렬 필드입니다');
    }
  }

  private validateSortOrder(sortOrder: string): void {
    const allowedOrders = ['asc', 'desc'];
    if (!allowedOrders.includes(sortOrder)) {
      throw new Error('유효하지 않은 정렬 순서입니다');
    }
  }

  addPaginationCondition(skip?: number, limit?: number): ProductQueryBuilder {
    if (skip !== undefined) {
      this.skip(skip);
    }

    if (limit !== undefined) {
      this.take(limit);
    }

    return this;
  }

  addFilterCondition(filter: ProductFilter): ProductQueryBuilder {
    return this.addKeywordCondition(filter.keyword)
      .addCategoryCondition(filter.categoryId)
      .addStatusCondition(filter.status)
      .addPriceRangeCondition(filter.priceRange)
      .addIsRecoverableCondition(filter.isRecoverable);
  }
}
