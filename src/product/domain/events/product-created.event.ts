import { DomainEvent } from 'src/common/event/domain-event';
import { Product } from '../models/product.model';

export class ProductCreatedEvent implements DomainEvent {
  readonly eventType = 'ProductCreated';
  readonly occurredAt = new Date();

  constructor(
    readonly aggregateId: string,
    readonly product: Product,
  ) {}
}
