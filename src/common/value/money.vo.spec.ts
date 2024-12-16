import { Money } from './money.vo';

describe('Money', () => {
  describe('of', () => {
    it('should create Money with valid amount', () => {
      // given
      const amount = 10000;

      // when
      const money = Money.of(amount);

      // then
      expect(money.amount).toBe(amount);
    });

    it('should throw error when amount is negative', () => {
      // given
      const amount = -10000;

      // when, then
      expect(() => Money.of(amount)).toThrow();
    });

    it('should throw error when amount is not integer', () => {
      // given
      const amount = 10000.5;

      // when, then
      expect(() => Money.of(amount)).toThrow();
    });

    it('should throw error when amount is not finite', () => {
      // given
      const amount = Number.POSITIVE_INFINITY;

      // when, then
      expect(() => Money.of(amount)).toThrow();
    });

    it('should throw error when amount is NaN', () => {
      // given
      const amount = NaN;

      // when, then
      expect(() => Money.of(amount)).toThrow();
    });
  });

  describe('add', () => {
    it('should add two moneys', () => {
      // given
      const money1 = Money.of(10000);
      const money2 = Money.of(20000);

      // when
      const result = money1.add(money2);

      // then
      expect(result.amount).toBe(30000);
    });
  });

  describe('subtract', () => {
    it('should subtract two moneys', () => {
      // given
      const money1 = Money.of(20000);
      const money2 = Money.of(10000);

      // when
      const result = money1.subtract(money2);

      // then
      expect(result.amount).toBe(10000);
    });
  });

  describe('multiply', () => {
    it('should multiply money by multiplier', () => {
      // given
      const money = Money.of(10000);
      const multiplier = 3;

      // when
      const result = money.multiply(multiplier);

      // then
      expect(result.amount).toBe(30000);
    });
  });

  describe('divide', () => {
    it('should divide money by divisor', () => {
      // given
      const money = Money.of(10000);
      const divisor = 2;

      // when
      const result = money.divide(divisor);

      // then
      expect(result.amount).toBe(5000);
    });

    it('should throw error when divisor is zero', () => {
      // given
      const money = Money.of(10000);
      const divisor = 0;

      // when, then
      expect(() => money.divide(divisor)).toThrow();
    });
  });
});
