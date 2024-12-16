import { DomainEvent } from 'src/common/event/domain-event';

export class ProductDeletedEvent implements DomainEvent {
  readonly eventType = 'ProductDeleted';
  readonly occurredAt = new Date();

  constructor(readonly aggregateId: string) {}
}
