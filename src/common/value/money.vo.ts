import { ValueObject } from '../ddd/value-object';
import { DomainValidationError } from '../error/validation';

interface MoneyProps {
  amount: number;
}

export class Money extends ValueObject<MoneyProps> {
  private readonly _amount: number;

  constructor(props: MoneyProps) {
    super(props);
    this.validateAmount(props.amount);
  }

  private validateAmount(amount: number): void {
    if (amount < 0) {
      throw new DomainValidationError('금액은 음수일 수 없습니다');
    }
  }

  static readonly ZERO = new Money({ amount: 0 });

  static of(amount: number): Money {
    return new Money({ amount });
  }

  get amount(): number {
    return this._amount;
  }

  public add(other: Money): Money {
    return Money.of(this.amount + other.amount);
  }

  public subtract(other: Money): Money {
    return Money.of(this.amount - other.amount);
  }

  public multiply(multiplier: number): Money {
    return Money.of(this.amount * multiplier);
  }

  public divide(divisor: number): Money {
    return Money.of(this.amount / divisor);
  }
}
