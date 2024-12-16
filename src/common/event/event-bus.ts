import { Injectable, Logger } from '@nestjs/common';
import { DomainEvent } from './domain-event';

type EventHandler = (event: DomainEvent) => Promise<void>;
@Injectable()
export class EventBus {
  private readonly logger: Logger = new Logger('EventBus');

  private readonly handlers: Map<string, EventHandler[]> = new Map();
  private static readonly SLOW_HANDLER_THRESHOLD_MS = 1000;

  public subscribe(eventType: string, handler: EventHandler): void {
    this.validateEventType(eventType);
    this.validateHandler(handler);
    const handlers = this.handlers.get(eventType) || [];
    if (handlers.includes(handler)) {
      this.logger.warn(
        `이벤트 타입 ${eventType}에 대한 핸들러가 이미 등록되어 있습니다`,
      );
      throw new Error(
        `이벤트 타입 ${eventType}에 대한 핸들러가 이미 등록되어 있습니다`,
      );
    }
    handlers.push(handler);
    this.handlers.set(eventType, handlers);
  }

  public async publish(event: DomainEvent): Promise<void> {
    if (!event?.eventType) throw new Error('유효한 이벤트 객체가 필요합니다');
    const startTime = performance.now();
    const handlers = this.handlers.get(event.eventType) || [];
    if (handlers.length === 0) {
      this.logger.warn(
        `이벤트 타입 ${event.eventType}에 대한 핸들러가 등록되어 있지 않습니다`,
      );
      return;
    }
    await Promise.allSettled(
      handlers.map(async (handler) => {
        try {
          const handlerStartTime = performance.now();
          await handler(event);
          const handlerDuration = performance.now() - handlerStartTime;
          if (handlerDuration > EventBus.SLOW_HANDLER_THRESHOLD_MS) {
            this.logger.warn(
              `이벤트 타입 ${event.eventType}에 대한 핸들러가 임계값 이상 소요되었습니다: ${handlerDuration}ms`,
            );
          }
        } catch (error) {
          this.logger.error(
            `이벤트 ${event.eventType} 처리 중 오류 발생: ${error.message}\naggregateId: ${event.aggregateId}\n소요시간: ${performance.now() - startTime}ms`,
          );
        }
      }),
    );
    const totalDuration = performance.now() - startTime;
    this.logger.debug(
      `이벤트 ${event.eventType} 처리 완료: ${totalDuration}ms`,
    );
  }

  public unsubscribe(eventType: string, handler: EventHandler): void {
    this.validateEventType(eventType);
    this.validateHandler(handler);
    const handlers = this.handlers.get(eventType);
    if (!handlers) {
      this.logger.warn(
        `이벤트 타입 ${eventType}에 대한 핸들러가 등록되어 있지 않습니다`,
      );
      return;
    }

    const index = handlers.indexOf(handler);

    if (index === -1)
      throw new Error(
        `이벤트 타입 ${eventType}에 대한 핸들러가 등록되어 있지 않습니다`,
      );

    handlers.splice(index, 1);
    this.logger.debug(`이벤트 타입 ${eventType}에 대한 핸들러를 제거했습니다`);
    if (handlers.length === 0) this.handlers.delete(eventType);
    else this.handlers.set(eventType, handlers);
  }

  private validateEventType(eventType: string): void {
    if (!eventType?.trim())
      throw new Error('eventType은 빈 문자열일 수 없습니다');
    if (eventType.includes(' '))
      throw new Error('eventType은 공백을 포함할 수 없습니다');
    if (eventType.length > 100)
      throw new Error('eventType은 100자 이하여야 합니다');
  }

  private validateHandler(handler: EventHandler): void {
    if (!handler || typeof handler !== 'function')
      throw new Error('handler는 함수이어야 합니다');
    if (handler.length !== 1)
      throw new Error('handler는 정확히 하나의 매개변수를 가져야 합니다');
  }
}
