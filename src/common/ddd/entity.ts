import { IdGenerator } from './id.generator';

export abstract class Entity<T = string> {
  protected readonly _id: T;

  constructor(id?: T) {
    this._id = id || (IdGenerator.generate() as T);
  }

  get id(): T {
    return this._id;
  }

  public equals(other: Entity<T>): boolean {
    if (!other) return false;
    return this._id === other.id;
  }
}
