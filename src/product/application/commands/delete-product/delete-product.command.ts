import { ProductId } from 'src/product/domain/models/product.model';

export class DeleteProductCommand {
  constructor(readonly id: ProductId) {}
}
