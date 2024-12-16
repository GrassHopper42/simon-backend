import { Money } from 'src/common/value/money.vo';
import { Price } from './price.vo';
import { PRICE_CONSTANTS } from 'src/product/constants/price.constant';

describe('Price', () => {
  describe('create', () => {
    it('should create price with tax', () => {
      // given
      const price = Price.of(Money.of(12000), 20);

      // then
      expect(price.withoutTax.amount).toBe(10000);
      expect(price.withTax.amount).toBe(12000);
      expect(price.taxAmount.amount).toBe(2000);
    });

    it('should create default tax rate', () => {
      // given
      const price = Price.of(Money.of(11000));

      // then
      expect(price.withoutTax.amount).toBe(10000);
      expect(price.taxRate).toBe(PRICE_CONSTANTS.DEFAULT_TAX_RATE);
    });

    it('should create price from tax included amount', () => {
      // given
      const price = Price.withoutTax(Money.of(10000), 10);

      // then
      expect(price.withoutTax.amount).toBe(10000);
      expect(price.withTax.amount).toBe(11000);
    });

    it('should throw error when tax rate is less than 0', () => {
      const taxRate = -1;
      // when, then
      expect(() => Price.of(Money.of(10000), taxRate)).toThrow();
    });

    it('should throw error when tax rate is greater than 100', () => {
      const taxRate = 101;
      // when, then
      expect(() => Price.of(Money.of(10000), taxRate)).toThrow();
    });

    it('should throw error when price is less than 0', () => {
      const price = -1;
      // when, then
      expect(() => Price.of(Money.of(price))).toThrow();
    });
  });
});
