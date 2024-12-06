export class CreateProductCommand {
  constructor(
    public readonly code: string,
    public readonly name: string,
    public readonly price: number,
    public readonly isRecovarable: boolean,
    public readonly categoryIds: string[],
    public readonly unit?: string,
    public readonly capacity?: string,
    public readonly specification?: string,
    public readonly description?: string,
  ) {}
}
