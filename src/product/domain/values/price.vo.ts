import { DomainValidationError } from 'src/common/error/validation';
import { Money } from 'src/common/value/money.vo';
import { PRICE_CONSTANTS } from 'src/product/constants/price.constant';

export class Price {
  private readonly _withTax: Money;

  private readonly _withoutTax: Money;

  private readonly _taxRate: number;

  private constructor(
    priceWithTax: Money,
    priceWithoutTax: Money,
    taxRate: number = PRICE_CONSTANTS.DEFAULT_TAX_RATE,
  ) {
    this._taxRate = taxRate;
    this._withTax = priceWithTax;
    this._withoutTax = priceWithoutTax;

    this.validate();
  }

  // Price는 기본적으로 부가세를 포함한 금액을 생성합니다.
  /**
   * 부가세를 포함한 금액을 생성합니다.
   * 부가세를 포함하지 않은 금액을 생성하려면 withoutTax를 사용하세요.
   * @param {Money} priceWithTax 부가세를 포함한 금액
   * @param {number} taxRate 부가세율 (기본값: 10)
   * @returns {Price} Price
   * @throws DomainValidationError
   * @example
   * const price = Price.of(Money.of(12000), 20);
   */
  static of(
    priceWithTax: Money,
    taxRate: number = PRICE_CONSTANTS.DEFAULT_TAX_RATE,
  ): Price {
    const priceWithoutTax = Price.calculatePriceWithoutTax(
      priceWithTax,
      taxRate,
    );
    return new Price(priceWithTax, priceWithoutTax, taxRate);
  }

  // 부가세를 포함하지 않은 금액을 생성합니다.
  /**
   * 부가세를 포함하지 않은 금액을 생성합니다.
   * 부가세를 포함한 금액을 생성하려면 of를 사용하세요.
   * @param priceWitouthTax 부가세를 포함하지 않은 금액
   * @param taxRate 부가세율 (기본값: 10)
   * @returns Price
   * @throws DomainValidationError
   * @example
   * const price = Price.withoutTax(Money.of(10000), 10);
   */
  static withoutTax(
    priceWitouthTax: Money,
    taxRate: number = PRICE_CONSTANTS.DEFAULT_TAX_RATE,
  ): Price {
    const priceWithTax = Price.calculateTaxIncludedPrice(
      priceWitouthTax,
      taxRate,
    );
    return new Price(priceWithTax, priceWitouthTax, taxRate);
  }

  private validate(): void {
    if (this._taxRate < 0) {
      throw new DomainValidationError('부가세율은 0 이상이어야 합니다');
    }
    if (this._taxRate > 100) {
      throw new DomainValidationError('부가세율은 100 이하여야 합니다');
    }
    if (
      this._withTax.amount <
      this._withoutTax.multiply(1 + this._taxRate / 100).amount
    ) {
      throw new DomainValidationError('부가세가 잘못 계산되었습니다');
    }
    if (
      !Price.isAlmostEqual(
        this._withoutTax.amount,
        this._withTax.multiply(100 / (100 + this._taxRate)).amount,
      )
    ) {
      throw new DomainValidationError('부가세가 잘못 계산되었습니다');
    }
  }

  private static calculateTaxIncludedPrice(
    price: Money,
    taxRate: number,
  ): Money {
    return price.multiply(1 + taxRate / 100);
  }

  private static calculatePriceWithoutTax(
    priceWithTax: Money,
    taxRate: number = PRICE_CONSTANTS.DEFAULT_TAX_RATE,
  ): Money {
    return priceWithTax.multiply(100 / (100 + taxRate));
  }

  private static readonly EPSILON = 0.000001;

  private static isAlmostEqual(a: number, b: number): boolean {
    return Math.abs(a - b) < Price.EPSILON;
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
