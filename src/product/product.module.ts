import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './infra/persistence/product.entity';
import { PRODUCT_REPOSITORY } from './domain/repository/product.repository';
import { ProductController } from './interface/api/product.controller';
import { CATEGORY_REPOSITORY } from './domain/repository/category.repository';
import { TypeormProductRepository } from './infra/repositories/product.typeorm.repository';
import { TypeormCategoryRepository } from './infra/repositories/category.typeorm.repository';
import { CreateProductHandler } from './application/commands/create-product/create-product.handler';
import { CategoryEntity } from './infra/persistence/category.entity';
import { CreateCategoryHandler } from './application/commands/create-category/create-category.handler';
import { UpdateProductHandler } from './application/commands/update-product/update-product.handler';
import { UpdateProductPriceHandler } from './application/commands/update-price/update-price.handler';
import { DeleteProductHandler } from './application/commands/delete-product/delete-product.handler';
import { GetProductHandler } from './application/queries/get-product.handler';
import { ListProductHandler } from './application/queries/list-product.handler';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CategoryEntity])],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: TypeormProductRepository,
    },
    {
      provide: CATEGORY_REPOSITORY,
      useClass: TypeormCategoryRepository,
    },
    CreateProductHandler,
    CreateCategoryHandler,
    UpdateProductHandler,
    UpdateProductPriceHandler,
    DeleteProductHandler,
    GetProductHandler,
    ListProductHandler,
  ],
  controllers: [ProductController],
})
export class ProductModule {}
