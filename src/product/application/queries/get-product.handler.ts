import { QueryHandler } from '@nestjs/cqrs';
import { GetProductQuery } from './get-product.query';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from 'src/product/domain/repository/product.repository';
import { Inject, NotFoundException } from '@nestjs/common';
import { Product } from 'src/product/domain/models/product.model';

@QueryHandler(GetProductQuery)
export class GetProductHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetProductQuery): Promise<Product> {
    const product = this.productRepository.findById(query.id);
    if (!product) {
      throw new NotFoundException(
        `ID가 ${query.id}인 제품을 찾을 수 없습니다.`,
      );
    }
    return product;
  }
}
