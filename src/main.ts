import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { winstonLogger } from './configs/winston.config';

async function bootstrap() {
  const logger = winstonLogger;
  const app = await NestFactory.create(AppModule, {
    logger,
    bufferLogs: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
