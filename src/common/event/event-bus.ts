import { Injectable } from '@nestjs/common';
import { DomainEvent } from './domain-event';

type EventHandler = (event: DomainEvent) => Promise<void>;
@Injectable()
export class EventBus {
  private readonly handlers: Map<string, EventHandler[]> = new Map();

  public subscribe(eventType: string, handler: EventHandler): void {
    this.validateEventType(eventType);
    this.validateHandler(handler);
    const handlers = this.handlers.get(eventType) || [];
    if (handlers.includes(handler))
      throw new Error('이벤트 핸들러가 이미 등록되어 있습니다');
    handlers.push(handler);
    this.handlers.set(eventType, handlers);
  }

  public async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventType) || [];
    await Promise.allSettled(
      handlers.map(async (handler) => {
        try {
          await handler(event);
        } catch (error) {
          console.error(
            JSON.stringify({
              level: 'error',
              eventType: event.eventType,
              error: error.message,
              timestamp: new Date().toISOString(),
              aggregateId: event.aggregateId,
            }),
          );
        }
      }),
    );
  }

  public unsubscribe(eventType: string, handler: EventHandler): void {
    this.validateEventType(eventType);
    this.validateHandler(handler);
    const handlers = this.handlers.get(eventType);
    if (!handlers) return;

    const index = handlers.indexOf(handler);

    if (index === -1) throw new Error('이벤트 핸들러가 등록되어 있지 않습니다');

    handlers.splice(index, 1);
    if (handlers.length === 0) this.handlers.delete(eventType);
    else this.handlers.set(eventType, handlers);
  }

  private validateEventType(eventType: string): void {
    if (!eventType.trim())
      throw new Error('eventType은 빈 문자열일 수 없습니다');
  }

  private validateHandler(handler: EventHandler): void {
    if (typeof handler !== 'function')
      throw new Error('handler는 함수이어야 합니다');
  }
}
