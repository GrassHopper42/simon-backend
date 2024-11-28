import { DomainValidationError } from 'src/common/error/validation';

export class Category {
  private _id?: number;

  private _name: string;
  private _parentId?: number;

  constructor(props: CategoryProps) {
    const { id, name, parentId } = props;
    this._id = id;
    this._name = name;
    this._parentId = parentId;

    this.validateName();
  }

  private validateName(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new DomainValidationError('카테고리 이름은 필수입니다');
    }
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

  updateName(name: string): Category {
    this._name = name;
    this.validateName();

    return this;
  }
}

interface CategoryProps {
  id?: number;
  name: string;
  parentId?: number | null;
}
