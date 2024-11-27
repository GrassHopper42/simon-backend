import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function TypeOrmConfig(configService: ConfigService) {
  const env = configService.get('NODE_ENV');
  if (!['dev', 'prod'].includes(env)) {
    throw new Error('Invalid NODE_ENV');
  }

  const synchronize =
    configService.get('SYCNHORNIZE') === 'true' ? true : false;
  const logging = configService.get('DB_LOGGING') === 'true' ? true : false;
  const DB_TYPE: 'postgres' | 'mysql' | null = 'postgres';

  const options: TypeOrmModuleOptions = {
    type: DB_TYPE,
    host: configService.get('DB_HOST'),
    port: +configService.get<number>('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    autoLoadEntities: true,
    synchronize: env === 'prod' ? false : synchronize,
    useUTC: false,
    logging,
    retryAttempts: env === 'prod' ? 10 : 1,
  };

  return options;
}
