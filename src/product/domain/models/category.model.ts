import { IsNotEmpty } from 'class-validator';

export class Category {
  private _id?: number;

  @IsNotEmpty({ message: '카테고리 이름은 필수입니다' })
  private _name: string;

  private _parentId?: number;

  constructor(props: CategoryProps) {
    const { name, parentId } = props;
    this._name = name;
    this._parentId = parentId;
  }

  get id(): number | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get parentId(): number | undefined {
    return this._parentId;
  }

  changeName(name: string): void {
    this._name = name;
  }

  protected setId(id: number): void {
    this._id = id;
  }
}

interface CategoryProps {
  name: string;
  parentId?: number | null;
}
