import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/domain/models/product.model';
import { ProductRepository } from 'src/product/domain/repository/product.repository';
import { Repository } from 'typeorm';
import { ProductMapper } from '../persistence/mapper/product.mapper';
import { ProductEntity } from '../persistence/product.entity';

@Injectable()
export class TypeormProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<Product[]> {
    const entities = await this.productRepository.find({
      relations: ['categories'],
    });
    return entities.map((entity) => ProductMapper.toDomain(entity));
  }

  async findById(id: number): Promise<Product | null> {
    const entity = await this.productRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async findByCode(code: string): Promise<Product | null> {
    const entity = await this.productRepository.findOne({
      where: { code },
      relations: ['categories'],
    });
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async findAllByCategory(categoryId: number): Promise<Product[]> {
    const entities = await this.productRepository.find({
      where: {
        categories: {
          id: categoryId,
        },
      },
      relations: ['categories'],
    });
    return entities.map((entity) => ProductMapper.toDomain(entity));
  }

  async save(product: Product): Promise<void> {
    const entity = ProductMapper.toEntity(product);
    await this.productRepository.insert(entity);
  }

  async update(product: Product): Promise<void> {
    const entity = ProductMapper.toEntity(product);
    await this.productRepository.update(entity.id, entity);
  }

  async delete(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
