import { Category } from '../category.model';

describe('Category', () => {
  describe('create', () => {
    it('should create category with valid name', () => {
      // given, when
      const category = new Category({ name: 'Test Category' });

      // then
      expect(category.name).toBe('Test Category');
    });

    it('should throw error when name is empty', () => {
      expect(() => new Category({ name: '' })).toThrow(
        '카테고리 이름은 필수입니다',
      );
    });
  });

  describe('updateName', () => {
    it('should update name correctly', () => {
      // given
      const category = new Category({ name: 'Old Name' });

      // when
      category.updateName('New Name');

      // then
      expect(category.name).toBe('New Name');
    });

    it('should throw error when updating to empty name', () => {
      // given
      const category = new Category({ name: 'Test' });

      // when, then
      expect(() => category.updateName('')).toThrow(
        '카테고리 이름은 필수입니다',
      );
    });
  });
});
