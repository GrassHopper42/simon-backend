import { DomainError } from './doamin-error';

export class DomainValidationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
