import { CommandHandler } from '@nestjs/cqrs';
import { UpdateProductPriceCommand } from './update-price.command';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
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
    if (!product) {
      throw new NotFoundException(
        `ID가 ${command.id}인 제품을 찾을 수 없습니다.`,
      );
    }
    this.validatePrice(command.price);
    const newPrice = this.getNewPrice(command);
    product.updatePrice(newPrice);

    await this.repository.update(product);
  }

  private getNewPrice(command: UpdateProductPriceCommand): Price {
    return command.includeTax
      ? Price.of(Money.of(command.price))
      : Price.withoutTax(Money.of(command.price));
  }

  private validatePrice(price: number): void {
    if (price < 0) {
      throw new BadRequestException('가격은 0 이상이어야 합니다.');
    }
  }
}
