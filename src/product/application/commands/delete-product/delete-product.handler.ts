import { CommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from './delete-product.command';
import { Inject, NotFoundException } from '@nestjs/common';
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
    if (!product) {
      throw new NotFoundException(
        `ID가 ${command.id}인 제품을 찾을 수 없습니다.`,
      );
    }
    product.delete();
    await this.repository.delete(product);
  }
}
