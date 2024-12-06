import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmConfig } from './configs/typeorm.config';
import { ProductModule } from './product/product.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, ProductModule],
      inject: [ConfigService],
      useFactory: TypeOrmConfig,
    }),
    CommonModule,
  ],
})
export class AppModule {}
