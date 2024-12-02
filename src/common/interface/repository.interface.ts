export interface Repository<T> {
  save(aggregate: T): Promise<void>;
  findById(id: any): Promise<T | null>;
}
