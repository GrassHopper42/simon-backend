import { ProductId } from 'src/product/domain/models/product.model';

export class UpdateProductCommand {
  constructor(
    readonly id: ProductId,
    readonly name?: string,
    readonly unit?: string,
    readonly capacity?: string,
    readonly specification?: string,
    readonly description?: string,
    readonly isRecoverable?: boolean,
  ) {}
}
