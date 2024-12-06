import { ProductId } from 'src/product/domain/models/product.model';

export class UpdateProductPriceCommand {
  constructor(
    readonly id: ProductId,
    readonly price: number,
    readonly includeTax: boolean,
  ) {}
}
