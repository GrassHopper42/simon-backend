export class CreateProductCommand {
  constructor(
    public readonly code: string,
    public readonly name: string,
    public readonly price: number,
    public readonly isRecoverable: boolean,
    public readonly categoryIds: string[],
    public readonly unit?: string,
    public readonly capacity?: string,
    public readonly specification?: string,
    public readonly description?: string,
  ) {
    if (price < 0) {
      throw new Error('가격은 0보다 작을 수 없습니다.');
    }
    if (code.length > 50) {
      throw new Error('코드는 50자 이하여야 합니다.');
    }
    if (name.length > 100) {
      throw new Error('이름은 100자 이하여야 합니다.');
    }
  }
}
