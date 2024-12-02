/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Injectable } from '@nestjs/common';
import { DomainEvent } from './domain-event';

@Injectable()
export class EventBus {
  private handlers: Map<string, Function[]> = new Map();

  public subscribe(eventType: string, handler: Function): void {
    const handlers = this.handlers.get(eventType) || [];
    handlers.push(handler);
    this.handlers.set(eventType, handlers);
  }

  public async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.eventType) || [];
    await Promise.all(handlers.map((handler) => handler(event)));
  }
}
