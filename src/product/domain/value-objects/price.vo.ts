import { Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Money } from 'src/common/value/money.vo';

const DEFAULT_TAX_RATE = 10;

export class Price {
  @ValidateNested()
  @Type(() => Money)
  private readonly priceWithTax: Money;

  @ValidateNested()
  @Type(() => Money)
  private readonly priceWithoutTax: Money;

  @Min(0)
  @Max(100)
  private readonly taxRate: number;

  private constructor(
    priceWithoutTax: Money,
    taxRate: number = DEFAULT_TAX_RATE,
  ) {
    this.taxRate = taxRate;
    this.priceWithoutTax = priceWithoutTax;
    this.priceWithTax = this.calculatePriceWithTax();
  }

  static of(priceWithoutTax: Money, taxRate: number = DEFAULT_TAX_RATE): Price {
    return new Price(priceWithoutTax, taxRate);
  }

  static withTax(
    priceWithTax: Money,
    taxRate: number = DEFAULT_TAX_RATE,
  ): Price {
    const priceWithoutTax = this.calculatePriceWithoutTax(
      priceWithTax,
      taxRate,
    );
    return new Price(priceWithoutTax, taxRate);
  }

  private calculatePriceWithTax(): Money {
    return this.priceWithoutTax.multiply(1 + this.taxRate / 100);
  }

  private static calculatePriceWithoutTax(
    priceWithTax: Money,
    taxRate: number = DEFAULT_TAX_RATE,
  ): Money {
    return priceWithTax.multiply(100 / (100 + taxRate));
  }

  getPriceWithTax(): Money {
    return this.priceWithTax;
  }

  getPriceWithoutTax(): Money {
    return this.priceWithoutTax;
  }

  getTaxRate(): number {
    return this.taxRate;
  }

  getTaxAmount(): Money {
    return this.priceWithTax.subtract(this.priceWithoutTax);
  }
}
