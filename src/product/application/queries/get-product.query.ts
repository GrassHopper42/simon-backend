import { ProductId } from 'src/product/domain/models/product.model';

export class GetProductQuery {
  constructor(public readonly id: ProductId) {}
}
