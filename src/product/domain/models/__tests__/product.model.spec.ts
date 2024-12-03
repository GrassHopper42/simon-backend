import { Money } from 'src/common/value/money.vo';
import { Price } from '../../values/price.vo';
import { Category } from '../category.model';
import { Product, ProductCode, ProductStatus } from '../product.model';

describe('Product Model', () => {
  const createCategory = (name: string, id: number): Category => {
    return new Category({ id, name });
  };

  const createProductCode = (code: string): ProductCode => {
    return code as ProductCode;
  };

  describe('create', () => {
    it('should create product with valid props', () => {
      // given
      const category = createCategory('Test Category', 1);
      const props = {
        code: createProductCode('TEST001'),
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
        code: createProductCode('AB'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category],
      };

      // when, then
      expect(() => new Product(props)).toThrow();
    });

    it('should throw error when name is empty', () => {
      const props = {
        code: createProductCode('TEST001'),
        name: '', // empty name
        price: Price.of(Money.of(10000)),
        categories: [createCategory('Test Category', 1)],
      };

      expect(() => new Product(props)).toThrow();
    });

    it('should throw error when categories is empty', () => {
      const props = {
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [], // empty categories
      };

      expect(() => new Product(props)).toThrow();
    });

    it('should throw error when price is missing', () => {
      const props = {
        code: createProductCode('TEST001'),
        name: 'Test Product',
        categories: [createCategory('Test Category', 1)],
      } as any;

      expect(() => new Product(props)).toThrow();
    });
  });

  describe('updatePrice', () => {
    it('should update price correctly', () => {
      // given
      const category = createCategory('Test Category', 1);
      const product = new Product({
        code: createProductCode('TEST001'),
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

  describe('category management', () => {
    it('should add category correctly', () => {
      // given
      const category = createCategory('Test Category', 1);
      const product = new Product({
        code: createProductCode('TEST001'),
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
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category],
      });

      // when, then
      expect(() => product.addCategory(category)).toThrow();
    });

    it('should remove category correctly', () => {
      const category1 = createCategory('Category 1', 1);
      const category2 = createCategory('Category 2', 2);
      const product = new Product({
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category1, category2],
      });

      product.removeCategory(category1.id);
      expect(product.categories).not.toContain(category1);
      expect(product.categories).toContain(category2);
    });

    it('should prevent removal of last category', () => {
      const category = createCategory('Test Category', 1);
      const product = new Product({
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category],
      });

      expect(() => product.removeCategory(category.id)).toThrow();
    });

    it('should check category existence correctly', () => {
      const category = createCategory('Test Category', 1);
      const product = new Product({
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category],
      });

      expect(product.hasCategory(category.id)).toBe(true);
      expect(product.hasCategory(999)).toBe(false);
    });
  });

  describe('status management', () => {
    let product: Product;

    beforeEach(() => {
      product = new Product({
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [createCategory('Test Category', 1)],
      });
    });

    it('should be ON_SALE by default', () => {
      expect(product.status).toBe(ProductStatus.ON_SALE);
    });

    it('should change status to DISCONTINUED when discontinued', () => {
      product.discontinue();
      expect(product.status).toBe(ProductStatus.DISCONTINUED);
    });

    it('should change status to ON_SALE when resumed', () => {
      product.discontinue();
      product.resume();
      expect(product.status).toBe(ProductStatus.ON_SALE);
    });
  });

  describe('updateProductDetail', () => {
    let product: Product;

    beforeEach(() => {
      product = new Product({
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [createCategory('Test Category', 1)],
      });
    });

    it('should update unit correctly', () => {
      product.updateProductDetail({ unit: 'BOX' });
      expect(product.unit).toBe('BOX');
    });

    it('should update capacity correctly', () => {
      product.updateProductDetail({ capacity: '100ml' });
      expect(product.capacity).toBe('100ml');
    });

    it('should update specification correctly', () => {
      product.updateProductDetail({ specification: 'Premium' });
      expect(product.specification).toBe('Premium');
    });

    it('should update description correctly', () => {
      product.updateProductDetail({ description: 'New description' });
      expect(product.description).toBe('New description');
    });

    it('should not modify unchanged fields', () => {
      const originalUnit = product.unit;
      product.updateProductDetail({ description: 'New description' });
      expect(product.unit).toBe(originalUnit);
    });
  });

  describe('recoverable management', () => {
    let product: Product;

    beforeEach(() => {
      product = new Product({
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [createCategory('Test Category', 1)],
      });
    });

    it('should set recoverable correctly', () => {
      product.setRecovarable(true);
      expect(product.isRecovarable).toBe(true);
    });

    it('should not change recoverable when undefined is passed', () => {
      const originalValue = product.isRecovarable;
      product.setRecovarable(undefined);
      expect(product.isRecovarable).toBe(originalValue);
    });
  });

  describe('immutability', () => {
    it('should return new array when getting categories', () => {
      const category = createCategory('Test Category', 1);
      const product = new Product({
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category],
      });

      const categories = product.categories;
      categories.push(createCategory('New Category', 2));

      expect(product.categories).toHaveLength(1);
    });
  });
});
