import { CommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from './update-product.command';
import { Inject } from '@nestjs/common';
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

    product
      .updateName(command.name)
      .updateProductDetail({
        unit: command.unit,
        capacity: command.capacity,
        specification: command.specification,
        description: command.description,
      })
      .setRecovarable(command.isRecovarable);

    await this.repository.update(product);
  }
}
