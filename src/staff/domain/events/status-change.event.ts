import { DomainEvent } from 'src/common/event/domain-event';
import { StaffStatus } from '../models/staff';

export class StatusChangeEvent implements DomainEvent {
  readonly eventType = 'StatusChange';
  readonly occurredAt = new Date();

  constructor(
    readonly aggregateId: string,
    readonly from: StaffStatus,
    readonly to: StaffStatus,
    readonly reason?: string,
  ) {}
}
