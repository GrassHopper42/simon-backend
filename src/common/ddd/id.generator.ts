import { ulid } from 'ulid';

export class IdGenerator {
  public static generate(): string {
    return ulid();
  }
}
