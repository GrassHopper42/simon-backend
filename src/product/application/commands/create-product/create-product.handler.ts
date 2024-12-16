import { CommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from 'src/product/domain/repository/product.repository';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
} from 'src/product/domain/repository/category.repository';
import { Product, ProductCode } from 'src/product/domain/models/product.model';
import { Price } from 'src/product/domain/values/price.vo';
import { Money } from 'src/common/value/money.vo';
import { ConflictException, Inject, NotFoundException } from '@nestjs/common';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(command: CreateProductCommand) {
    await this.validateProductCodeNotExists(command.code);
    const categories = await this.categoryRepository.findAllByIds(
      command.categoryIds,
    );
    if (categories.length !== command.categoryIds.length) {
      throw new NotFoundException('일부 카테고리를 찾을 수 없습니다.');
    }

    const product = Product.create({
      code: command.code as ProductCode,
      name: command.name,
      price: Price.of(Money.of(command.price)),
      isRecoverable: command.isRecoverable,
      categories,
      unit: command.unit,
      capacity: command.capacity,
      specification: command.specification,
      description: command.description,
    });

    await this.productRepository.save(product);
  }

  private async validateProductCodeNotExists(code: string) {
    const product = await this.productRepository.findByCode(code);
    if (product) {
      throw new ConflictException('이미 존재하는 코드입니다.');
    }
  }
}
