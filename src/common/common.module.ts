import { Global, Module } from '@nestjs/common';
import { EventBus } from './event/event-bus';

@Global()
@Module({
  providers: [EventBus],
  exports: [EventBus],
})
export class CommonModule {}
