import { CommandHandler } from '@nestjs/cqrs';
import { UpdateProductPriceCommand } from './update-price.command';
import { Inject } from '@nestjs/common';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from 'src/product/domain/repository/product.repository';
import { Price } from 'src/product/domain/values/price.vo';
import { Money } from 'src/common/value/money.vo';

@CommandHandler(UpdateProductPriceCommand)
export class UpdateProductPriceHandler {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository,
  ) {}
  async execute(command: UpdateProductPriceCommand) {
    const product = await this.repository.findById(command.id);
    const newPrice = this.getNewPrice(command);
    product.updatePrice(newPrice);

    await this.repository.update(product);
  }

  private getNewPrice(command: UpdateProductPriceCommand): Price {
    return command.includeTax
      ? Price.withTax(Money.of(command.price))
      : Price.of(Money.of(command.price));
  }
}
