import { generateId } from 'src/common/ddd/id.generator';

export class PartyId {
  constructor(readonly id: string) {}

  static create() {
    return new PartyId(generateId());
  }
}
