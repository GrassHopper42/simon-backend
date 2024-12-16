import { QueryHandler } from '@nestjs/cqrs';
import { ListProductQuery } from './list-product.query';
import { PaginatedResponse } from 'src/common/types/pagination';
import { ProductSummaryDTO } from '../dtos/product.dto';
import {
  PRODUCT_REPOSITORY,
  ProductFilter,
  ProductRepository,
} from 'src/product/domain/repository/product.repository';
import { Inject, InternalServerErrorException } from '@nestjs/common';
import {
  calcSkip,
  createPagination,
  validatePage,
} from 'src/common/utils/pagination';
import { Product } from 'src/product/domain/models/product.model';
import { toProductSummaryDTO } from '../dtos/mappers/product.mapper';

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
    let page = Math.max(1, query.page || 1);
    const limit = Math.max(1, query.limit || 10);
    const filter: ProductFilter = {
      categoryId: query.categoryId,
      status: query.status,
      keyword: query.keyword,
    };

    let total = 0;
    let products: Product[];

    try {
      // 총 상품 수 조회
      total = await this.productRepository.count(filter);

      // 페이지 계산
      page = validatePage(page, limit, total);
      const skip = calcSkip(page, limit);

      // 상품 목록 조회
      products = await this.productRepository.findMany(filter, {
        sort: query.sort,
        skip,
        limit,
      });
    } catch (_) {
      throw new InternalServerErrorException(
        `상품 목록을 조회하는 중 오류가 발생했습니다.`,
      );
    }

    // DTO로 변환
    const items = products.map((product) => toProductSummaryDTO(product));
    return createPagination(items, { page, limit, total });
  }
}
