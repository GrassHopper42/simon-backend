import { CommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from './update-product.command';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from 'src/product/domain/repository/product.repository';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository,
  ) {}
  async execute(command: UpdateProductCommand) {
    const product = await this.repository.findById(command.id);
    if (!product) {
      throw new NotFoundException(
        `ID가 ${command.id}인 제품을 찾을 수 없습니다.`,
      );
    }

    product
      .updateName(command.name)
      .updateProductDetail({
        unit: command.unit,
        capacity: command.capacity,
        specification: command.specification,
        description: command.description,
      })
      .setRecoverable(command.isRecoverable);

    await this.repository.update(product);
  }
}
