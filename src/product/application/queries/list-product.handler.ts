import { QueryHandler } from '@nestjs/cqrs';
import { ListProductQuery } from './list-product.query';
import { PaginatedResponse } from 'src/common/types/pagination';
import { ProductSummaryDTO } from '../dtos/product.dto';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from 'src/product/domain/repository/product.repository';
import { PaginationFactory } from 'src/common/utils/pagination';
import { ProductMapper } from '../dtos/mappers/product.mapper';
import { Inject } from '@nestjs/common';

@QueryHandler(ListProductQuery)
export class ListProductHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    query: ListProductQuery,
  ): Promise<PaginatedResponse<ProductSummaryDTO>> {
    // 쿼리 파라미터
    let page = query.page || 1;
    const limit = query.limit || 10;
    const filter = {
      categoryId: query.categoryId,
      status: query.status,
      keyword: query.keyword,
    };

    // 총 상품 수 조회
    const total = await this.productRepository.count(filter);

    // 페이지 계산
    page = PaginationFactory.validatePage(page, limit, total);
    const skip = PaginationFactory.calcSkip(page, limit);

    // 상품 목록 조회
    const products = await this.productRepository.findMany(filter, {
      sort: query.sort,
      skip,
      limit,
    });

    // DTO로 변환
    const items = products.map((product) =>
      ProductMapper.toSummaryDTO(product),
    );
    return PaginationFactory.create(items, { page, limit, total });
  }
}
