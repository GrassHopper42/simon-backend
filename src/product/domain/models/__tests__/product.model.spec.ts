import { Money } from 'src/common/value/money.vo';
import { Price } from '../../values/price.vo';
import { Category } from '../category.model';
import { Product, ProductCode, ProductStatus } from '../product.model';
import { generateId } from 'src/common/ddd/id.generator';

describe('Product Model', () => {
  const createProductCode = (code: string): ProductCode => {
    return code as ProductCode;
  };

  describe('create', () => {
    it('should create product with valid props', () => {
      // given
      const category = Category.create({ name: 'Test Category' });
      const props = {
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category],
      };

      // when
      const product = Product.create(props);

      // then
      expect(product.code).toBe(props.code);
    });

    it('should throw error when code is less than 3 characters', () => {
      // given
      const category = Category.create({ name: 'Test Category' });
      const props = {
        code: createProductCode('AB'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category],
      };

      // when, then
      expect(() => Product.create(props)).toThrow();
    });

    it('should throw error when name is empty', () => {
      const props = {
        code: createProductCode('TEST001'),
        name: '', // empty name
        price: Price.of(Money.of(10000)),
        categories: [Category.create({ name: 'Test Category' })],
      };

      expect(() => Product.create(props)).toThrow();
    });

    it('should throw error when categories is empty', () => {
      const props = {
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [], // empty categories
      };

      expect(() => Product.create(props)).toThrow();
    });

    it('should throw error when price is missing', () => {
      const props = {
        code: createProductCode('TEST001'),
        name: 'Test Product',
        categories: [Category.create({ name: 'Test Category' })],
      } as any;

      expect(() => Product.create(props)).toThrow();
    });
  });

  describe('updatePrice', () => {
    it('should update price correctly', () => {
      // given
      const category = Category.create({ name: 'Test Category' });
      const product = Product.create({
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category],
      });
      const newPrice = Price.of(Money.of(20000));

      // when
      const updatedProduct = product.updatePrice(Price.of(Money.of(20000)));

      // then
      expect(updatedProduct.price).toEqual(newPrice);
    });
  });

  describe('category management', () => {
    it('should add category correctly', () => {
      // given
      const category = Category.create({ name: 'Test Category' });
      const product = Product.create({
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category],
      });
      const newCategory = Category.create({ name: 'New Category' });

      // when
      const updatedProduct = product.addCategory(newCategory);

      // then
      expect(updatedProduct.categories).toContain(newCategory);
    });

    it('should throw error when category is already added', () => {
      // given
      const category = Category.create({ name: 'Test Category' });
      const product = Product.create({
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category],
      });

      // when, then
      expect(() => product.addCategory(category)).toThrow();
    });

    it('should remove category correctly', () => {
      const category1 = Category.create({ name: 'Category 1' });
      const category2 = Category.create({ name: 'Category 2' });
      const product = Product.create({
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category1, category2],
      });

      const updatedProduct = product.removeCategory(category1.id);
      expect(updatedProduct.categories).not.toContain(category1);
      expect(updatedProduct.categories).toContain(category2);
    });

    it('should prevent removal of last category', () => {
      const category = Category.create({ name: 'Test Category' });
      const product = Product.create({
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category],
      });

      expect(() => product.removeCategory(category.id)).toThrow();
    });

    it('should check category existence correctly', () => {
      const category = Category.create({ name: 'Test Category' });
      const product = Product.create({
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category],
      });

      expect(product.hasCategory(category.id)).toBe(true);
      expect(product.hasCategory(generateId())).toBe(false);
    });
  });

  describe('status management', () => {
    let product: Product;

    beforeEach(() => {
      product = Product.create({
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [Category.create({ name: 'Test Category' })],
      });
    });

    it('should be ON_SALE by default', () => {
      expect(product.status).toBe(ProductStatus.ON_SALE);
    });

    it('should change status to DISCONTINUED when discontinued', () => {
      const updatedProduct = product.discontinue();
      expect(updatedProduct.status).toBe(ProductStatus.DISCONTINUED);
    });

    it('should change status to ON_SALE when resumed', () => {
      const updatedProduct = product.discontinue().resume();
      expect(updatedProduct.status).toBe(ProductStatus.ON_SALE);
    });
  });

  describe('updateProductDetail', () => {
    let product: Product;

    beforeEach(() => {
      product = Product.create({
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [Category.create({ name: 'Test Category' })],
      });
    });

    it('should update unit correctly', () => {
      const updatedProduct = product.updateProductDetail({ unit: 'BOX' });
      expect(updatedProduct.unit).toBe('BOX');
    });

    it('should update capacity correctly', () => {
      const updatedProduct = product.updateProductDetail({ capacity: '100ml' });
      expect(updatedProduct.capacity).toBe('100ml');
    });

    it('should update specification correctly', () => {
      const updatedProduct = product.updateProductDetail({
        specification: 'Premium',
      });
      expect(updatedProduct.specification).toBe('Premium');
    });

    it('should update description correctly', () => {
      const updatedProduct = product.updateProductDetail({
        description: 'New description',
      });
      expect(updatedProduct.description).toBe('New description');
    });

    it('should not modify unchanged fields', () => {
      const originalUnit = product.unit;
      const updatedProduct = product.updateProductDetail({
        description: 'New description',
      });
      expect(updatedProduct.unit).toBe(originalUnit);
    });
  });

  describe('recoverable management', () => {
    let product: Product;

    beforeEach(() => {
      product = Product.create({
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [Category.create({ name: 'Test Category' })],
      });
    });

    it('should set recoverable correctly', () => {
      const updatedProduct = product.setRecoverable(true);
      expect(updatedProduct.isRecoverable).toBe(true);
    });

    it('should not change recoverable when undefined is passed', () => {
      const originalValue = product.isRecoverable;
      const updatedProduct = product.setRecoverable(undefined);
      expect(updatedProduct.isRecoverable).toBe(originalValue);
    });
  });

  describe('immutability', () => {
    it('should return new array when getting categories', () => {
      const category = Category.create({ name: 'Test Category' });
      const product = Product.create({
        code: createProductCode('TEST001'),
        name: 'Test Product',
        price: Price.of(Money.of(10000)),
        categories: [category],
      });

      const categories = product.categories;
      categories.push(Category.create({ name: 'New Category' }));

      expect(product.categories).toHaveLength(1);
    });
  });
});
