export abstract class ValueObject<T extends Record<string, any>> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public equals(other: ValueObject<T>): boolean {
    if (!other) return false;
    return Object.entries(this.props).every(
      ([key, value]) => other.props[key] === value,
    );
  }
}
