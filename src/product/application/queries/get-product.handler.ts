import { QueryHandler } from '@nestjs/cqrs';
import { GetProductQuery } from './get-product.query';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from 'src/product/domain/repository/product.repository';
import { Inject } from '@nestjs/common';

@QueryHandler(GetProductQuery)
export class GetProductHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetProductQuery) {
    return this.productRepository.findById(query.id);
  }
}
