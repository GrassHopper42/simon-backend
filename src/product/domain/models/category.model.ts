import { DomainValidationError } from 'src/common/error/validation';

export class Category {
  private _id?: number;

  private _name: string;
  private _parentId?: number;

  constructor(props: CategoryProps) {
    const { id, name, parentId } = props;
    this.validateName(name);
    this.validateCircularReference(parentId);

    this._id = id;
    this._name = name;
    this._parentId = parentId;
  }

  private validateCircularReference(parentId: number): void {
    if (this._id === parentId) {
      throw new DomainValidationError(
        '부모 카테고리를 자기 자신으로 설정할 수 없습니다',
      );
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
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
    this.validateName(name);
    this._name = name;

    return this;
  }
}

interface CategoryProps {
  id?: number;
  name: string;
  parentId?: number | null;
}
