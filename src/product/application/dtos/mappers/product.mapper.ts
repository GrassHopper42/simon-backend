import { Product } from 'src/product/domain/models/product.model';
import { ProductDTO, ProductSummaryDTO } from '../product.dto';

export class ProductMapper {
  static toDTO(product: Product): ProductDTO {
    return {
      id: product.id.toString(),
      code: product.code.toString(),
      name: product.name,
      priceWithoutTax: product.price.withoutTax.amount,
      priceWithTax: product.price.withTax.amount,
      unit: product.unit,
      capacity: product.capacity,
      specification: product.specification,
      description: product.description,
      isRecoverable: product.isRecoverable,
      status: product.status,
      categories: product.categories.map((category) => ({
        id: category.id,
        name: category.name,
        parentId: category.parentId,
      })),
    };
  }

  static toSummaryDTO(product: Product): ProductSummaryDTO {
    return {
      id: product.id.toString(),
      code: product.code.toString(),
      name: product.name,
      priceWithTax: product.price.withTax.amount,
      isRecoverable: product.isRecoverable,
      status: product.status,
      mainCategory:
        product.categories.length > 0 ? product.categories[0].name : null,
    };
  }
}
