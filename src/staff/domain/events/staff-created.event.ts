import { DomainEvent } from 'src/common/event/domain-event';
import { Staff } from '../models/staff';

export class StaffCreatedEvent implements DomainEvent {
  readonly eventType = 'StaffCreated';
  readonly occurredAt = new Date();

  constructor(
    readonly aggregateId: string,
    readonly staff: Staff,
  ) {}
}
