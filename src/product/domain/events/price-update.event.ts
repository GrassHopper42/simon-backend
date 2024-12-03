import { DomainEvent } from 'src/common/event/domain-event';
import { Price } from '../values/price.vo';

export class ProductPriceUpdated implements DomainEvent {
  readonly eventType = 'ProductPriceUpdated';
  readonly occurredAt: Date;

  constructor(
    readonly aggregateId: string,
    readonly oldPrice: Price,
    readonly newPrice: Price,
  ) {
    this.occurredAt = new Date();
  }
}
