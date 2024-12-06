import { CommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from './delete-product.command';
import { Inject } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from 'src/product/domain/repository/product.repository';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository,
  ) {}
  async execute(command: DeleteProductCommand) {
    const product = await this.repository.findById(command.id);
    product.delete();
    await this.repository.delete(product);
  }
}
