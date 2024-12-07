import { DomainValidationError } from 'src/common/error/validation';
import { Money } from 'src/common/value/money.vo';
import { PRICE_CONSTANTS } from 'src/product/constants/price.constant';

export class Price {
  private readonly _withTax: Money;

  private readonly _withoutTax: Money;

  private readonly _taxRate: number;

  private constructor(
    priceWithoutTax: Money,
    taxRate: number = PRICE_CONSTANTS.DEFAULT_TAX_RATE,
  ) {
    this._taxRate = taxRate;
    this._withoutTax = priceWithoutTax;
    this._withTax = this.calculateTaxIncludedPrice();

    this.validate();
  }

  static of(
    priceWithoutTax: Money,
    taxRate: number = PRICE_CONSTANTS.DEFAULT_TAX_RATE,
  ): Price {
    return new Price(priceWithoutTax, taxRate);
  }

  static withTax(
    priceWithTax: Money,
    taxRate: number = PRICE_CONSTANTS.DEFAULT_TAX_RATE,
  ): Price {
    const priceWithoutTax = Price.calculatePriceWithoutTax(
      priceWithTax,
      taxRate,
    );
    return new Price(priceWithoutTax, taxRate);
  }

  private validate(): void {
    if (this._taxRate < 0) {
      throw new DomainValidationError('부가세율은 0 이상이어야 합니다');
    }
    if (this._taxRate > 100) {
      throw new DomainValidationError('부가세율은 100 이하여야 합니다');
    }
  }

  private calculateTaxIncludedPrice(): Money {
    return this._withoutTax.multiply(1 + this._taxRate / 100);
  }

  private static calculatePriceWithoutTax(
    priceWithTax: Money,
    taxRate: number = PRICE_CONSTANTS.DEFAULT_TAX_RATE,
  ): Money {
    return priceWithTax.multiply(100 / (100 + taxRate));
  }

  get withTax(): Money {
    return this._withTax;
  }

  get withoutTax(): Money {
    return this._withoutTax;
  }

  get taxRate(): number {
    return this._taxRate;
  }

  get taxAmount(): Money {
    return this._withTax.subtract(this._withoutTax);
  }
}
