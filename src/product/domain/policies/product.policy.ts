import { DomainValidationError } from 'src/common/error/validation';
import { Result } from 'src/common/types/result';
import { Category } from '../models/category.model';
import { ProductCode } from '../models/product.model';
import { Price } from '../values/price.vo';

const MIN_CODE_LENGTH = 3;
const PRODUCT_CODE_PATTERN = /^[A-Z0-9]+$/;

// src/product/domain/policies/product.policy.ts
export class ProductPolicy {
  static validateName(name: string): Result<string, DomainValidationError> {
    if (!name || name.trim().length === 0) {
      return {
        success: false,
        error: new DomainValidationError('상품 이름은 필수입니다'),
      };
    }

    return { success: true, value: name };
  }

  static validateCode(
    code: string,
  ): Result<ProductCode, DomainValidationError> {
    const sanitizedCode = code.trim();
    if (!sanitizedCode || sanitizedCode.length < MIN_CODE_LENGTH) {
      return {
        success: false,
        error: new DomainValidationError('상품 코드는 3자 이상이어야 합니다'),
      };
    }

    if (!PRODUCT_CODE_PATTERN.test(sanitizedCode)) {
      return {
        success: false,
        error: new DomainValidationError(
          '상품 코드는 영대문자와 숫자만 사용 가능합니다',
        ),
      };
    }

    return { success: true, value: code as ProductCode };
  }

  static validateCategories(
    categories: Category[],
  ): Result<Category[], DomainValidationError> {
    if (!categories || categories.length === 0) {
      return {
        success: false,
        error: new DomainValidationError(
          '최소 하나 이상의 카테고리가 필요합니다',
        ),
      };
    }

    return { success: true, value: categories };
  }

  static validatePrice(price: Price): Result<Price, DomainValidationError> {
    if (!price) {
      return {
        success: false,
        error: new DomainValidationError('상품 가격은 필수입니다'),
      };
    }

    return { success: true, value: price };
  }
}
