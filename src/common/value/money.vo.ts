import { Min } from 'class-validator';

export class Money {
  @Min(0, { message: '금액은 음수일 수 없습니다' })
  private readonly amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }

  static readonly ZERO = new Money(0);

  static of(amount: number): Money {
    return new Money(amount);
  }

  public getAmount(): number {
    return this.amount;
  }

  public add(money: Money): Money {
    return new Money(this.amount + money.amount);
  }

  public subtract(money: Money): Money {
    return new Money(this.amount - money.amount);
  }

  public multiply(multiplier: number): Money {
    return new Money(this.amount * multiplier);
  }

  public divide(divisor: number): Money {
    return new Money(this.amount / divisor);
  }
}
