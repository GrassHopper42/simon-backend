import { CommandHandler } from '@nestjs/cqrs';
import { CreateCategoryCommand } from './create-category.command';
import {
  CATEGORY_REPOSITORY,
  CategoryRepository,
} from 'src/product/domain/repository/category.repository';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { Category } from 'src/product/domain/models/category.model';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(command: CreateCategoryCommand) {
    // 새로운 이름 중복 체크, 부모 카테고리 존재 여부
    await Promise.all([
      this.validateNewName(command.name),
      this.validateParentCategory(command.parentId),
    ]);

    const category = Category.create({
      name: command.name,
      parentId: command.parentId,
    });

    await this.categoryRepository.save(category);
  }

  private validateNewName = async (name: string): Promise<void> => {
    const category = await this.categoryRepository.findByName(name);
    if (category) {
      throw new BadRequestException('이미 존재하는 이름입니다.');
    }
  };

  private validateParentCategory = async (parentId?: string): Promise<void> => {
    if (parentId) {
      const parent = await this.categoryRepository.findById(parentId);
      if (!parent) {
        throw new NotFoundException('부모 카테고리가 존재하지 않습니다.');
      }
    }
  };
}
