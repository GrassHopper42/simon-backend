import { Money } from 'src/common/value/money.vo';
import { Price } from '../../values/price.vo';
import { Category } from '../category.model';
import { Product } from '../product.model';

describe('Product Model', () => {
  const createCategory = (name: string, id: number): Category => {
    return new Category({ id, name });
  };

  describe('create', () => {
    it('should create product with valid props', () => {
      // given
      const category = createCategory('Test Category', 1);
      const props = {
        code: 'TEST001',
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category],
      };

      // when
      const product = new Product(props);

      // then
      expect(product.code).toBe(props.code);
    });

    it('should throw error when code is less than 3 characters', () => {
      // given
      const category = createCategory('Test Category', 1);
      const props = {
        code: 'AB',
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category],
      };

      // when, then
      expect(() => new Product(props)).toThrow();
    });
  });

  describe('updatePrice', () => {
    it('should update price correctly', () => {
      // given
      const category = createCategory('Test Category', 1);
      const product = new Product({
        code: 'TEST001',
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category],
      });
      const newPrice = Price.of(Money.of(20000));

      // when
      product.updatePrice(Price.of(Money.of(20000)));

      // then
      expect(product.price).toEqual(newPrice);
    });
  });

  describe('addCategory', () => {
    it('should add category correctly', () => {
      // given
      const category = createCategory('Test Category', 1);
      const product = new Product({
        code: 'TEST001',
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category],
      });
      const newCategory = createCategory('New Category', 2);

      // when
      product.addCategory(newCategory);

      // then
      expect(product.categories).toContain(newCategory);
    });

    it('should throw error when category is already added', () => {
      // given
      const category = createCategory('Test Category', 1);
      const product = new Product({
        code: 'TEST001',
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category],
      });

      // when, then
      expect(() => product.addCategory(category)).toThrow();
    });
  });
});
