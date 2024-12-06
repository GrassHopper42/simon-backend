import { Body, Controller, Get, Patch, Post, Put, Query } from '@nestjs/common';
import { CreateProductHandler } from 'src/product/application/commands/create-product/create-product.handler';
import { UpdateProductPriceHandler } from 'src/product/application/commands/update-price/update-price.handler';
import { UpdateProductHandler } from 'src/product/application/commands/update-product/update-product.handler';
import { GetProductHandler } from 'src/product/application/queries/get-product.handler';
import { ListProductHandler } from 'src/product/application/queries/list-product.handler';
import { ProductId } from 'src/product/domain/models/product.model';
import { CreateProductDto } from '../dto/create-product.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductHandler: CreateProductHandler,
    private readonly updateProductHandler: UpdateProductHandler,
    private readonly updateProductPriceHandler: UpdateProductPriceHandler,
    private readonly getProductHandler: GetProductHandler,
    private readonly listProductHandler: ListProductHandler,
  ) {}

  @Get()
  async list(
    @Query('query') query: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('sortBy')
    sort: 'name' | 'price' | 'code' | 'createdAt' | 'updatedAt',
    @Query('order') order: 'asc' | 'desc',
  ) {
    return this.listProductHandler.execute({
      keyword: query,
      page,
      limit,
      sort: { field: sort, order },
    });
  }

  @Get(':id')
  async get(@Query('id') id: ProductId) {
    return this.getProductHandler.execute({ id });
  }

  @Post()
  async create(@Body() body: CreateProductDto) {
    return this.createProductHandler.execute(body);
  }

  @Put(':id')
  async update(@Query('id') id: ProductId, @Body() body: any) {
    return this.updateProductHandler.execute({ id, ...body });
  }

  @Patch(':id/price')
  async updatePrice(@Query('id') id: ProductId, @Body() body: any) {
    return this.updateProductPriceHandler.execute({ id, ...body });
  }
}
