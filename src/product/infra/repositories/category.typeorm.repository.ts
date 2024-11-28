import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/product/domain/models/category.model';
import { CategoryRepository } from 'src/product/domain/repository/category.repository';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../persistence/category.entity';
import { CategoryMapper } from '../persistence/mapper/category.mapper';

@Injectable()
export class TypeormCategoryRepository implements CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAll(): Promise<Category[]> {
    const entities = await this.categoryRepository.find();
    return entities.map((entity) => CategoryMapper.toDomain(entity));
  }

  async findById(id: number): Promise<Category | null> {
    const entity = await this.categoryRepository.findOne({ where: { id } });
    return entity ? CategoryMapper.toDomain(entity) : null;
  }

  async findByName(name: string): Promise<Category | null> {
    const entity = await this.categoryRepository.findOne({ where: { name } });
    return entity ? CategoryMapper.toDomain(entity) : null;
  }

  async findChildren(parentId: number): Promise<Category[]> {
    const entities = await this.categoryRepository.find({
      where: { parentId },
    });
    return entities.map((entity) => CategoryMapper.toDomain(entity));
  }

  async save(category: Category): Promise<void> {
    const entity = CategoryMapper.toEntity(category);
    await this.categoryRepository.insert(entity);
  }

  async update(category: Category): Promise<void> {
    const entity = CategoryMapper.toEntity(category);
    await this.categoryRepository.update(entity.id, entity);
  }

  async delete(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
