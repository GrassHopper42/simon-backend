export interface DomainEvent {
  readonly occurredAt: Date; // 이벤트 발생 시간
  readonly eventType: string; // 이벤트 타입
  readonly aggregateId: string; // 이벤트가 발생한 Aggregate의 ID
}
