import { CategoryId } from 'src/product/domain/models/category.model';

export class CreateCategoryCommand {
  constructor(
    public readonly name: string,
    public readonly parentId?: CategoryId,
  ) {}
}
