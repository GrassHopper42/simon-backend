export abstract class Entity<T = string> {
  protected readonly _id: T;

  constructor(id: T) {
    this._id = id;
  }

  get id(): T {
    return this._id;
  }

  public equals(other: this): boolean {
    if (!other) return false;
    return this._id === other.id;
  }
}
