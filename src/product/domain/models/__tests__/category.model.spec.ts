import { Category } from '../category.model';

describe('Category', () => {
  describe('create', () => {
    it('should create category with valid name', () => {
      // given, when
      const category = Category.create({ name: 'Test Category' });

      // then
      expect(category.name).toBe('Test Category');
    });

    it('should throw error when name is empty', () => {
      expect(() => Category.create({ name: '' })).toThrow(
        '카테고리 이름은 필수입니다',
      );
    });

    it('should create category with parent category', () => {
      // given
      const parentCategory = Category.create({ name: 'Parent Category' });

      // when
      const category = Category.create({
        name: 'Child Category',
        parentId: parentCategory.id,
      });

      // then
      expect(category.parentId).toBe(parentCategory.id);
    });

    // 최대 길이 제한 검증
    it('should throw error when name is too long', () => {
      // given
      const name = 'a'.repeat(51);

      // when, then
      expect(() => Category.create({ name })).toThrow(
        '카테고리 이름은 50자 이하여야 합니다',
      );
    });

    // 특수 문자 처리 검증
    it('should throw error when name contains special characters', () => {
      // given
      const name = 'Test!@#$%^&*()';

      // when, then
      expect(() => Category.create({ name })).toThrow(
        '카테고리 이름에 특수 문자를 사용할 수 없습니다',
      );
    });
  });

  describe('updateName', () => {
    it('should update name correctly', () => {
      // given
      const category = Category.create({ name: 'Old Name' });

      // when
      const updatedCategory = category.updateName('New Name');

      // then
      expect(updatedCategory.name).toBe('New Name');
    });

    it('should throw error when updating to empty name', () => {
      // given
      const category = Category.create({ name: 'Test' });

      // when, then
      expect(() => category.updateName('')).toThrow(
        '카테고리 이름은 필수입니다',
      );
    });
  });

  describe('updateParentId', () => {
    it('should update parent id correctly', () => {
      // given
      const childCategory = Category.create({
        name: 'Child Category',
      });
      const parentCategory = Category.create({ name: 'Parent Category' });

      // when
      const updatedCategory = childCategory.updateParentId(parentCategory.id);

      // then
      expect(updatedCategory.parentId).toBe(parentCategory.id);
    });

    it('should throw error when updating to circular reference', () => {
      // given
      const category = Category.create({ name: 'Test Category' });

      // when, then
      expect(() => category.updateParentId(category.id)).toThrow(
        '부모 카테고리를 자기 자신으로 설정할 수 없습니다',
      );
    });
  });
});
