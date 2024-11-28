import { DomainValidationError } from '../error/validation';

export class Money {
  private readonly _amount: number;

  constructor(amount: number) {
    this._amount = amount;

    this.validate();
  }

  private validate(): void {
    if (this._amount < 0) {
      throw new DomainValidationError('금액은 음수일 수 없습니다');
    }
  }

  static readonly ZERO = new Money(0);

  static of(amount: number): Money {
    return new Money(amount);
  }

  get amount(): number {
    return this._amount;
  }

  public add(money: Money): Money {
    return new Money(this._amount + money._amount);
  }

  public subtract(money: Money): Money {
    return new Money(this._amount - money._amount);
  }

  public multiply(multiplier: number): Money {
    return new Money(this._amount * multiplier);
  }

  public divide(divisor: number): Money {
    return new Money(this._amount / divisor);
  }
}
