import { Entity } from 'src/common/ddd/entity';
import { generateId } from 'src/common/ddd/id.generator';
import { DomainValidationError } from 'src/common/error/validation';
import { Branded } from 'src/common/types/branded';

export type CategoryId = Branded<string, 'CategoryId'>;

export class Category extends Entity<CategoryId> {
  private _name: string;
  private _parentId?: string;

  constructor(props: CategoryProps) {
    const { id, name, parentId } = props;
    super(id);
    this.validateName(name);
    this.validateCircularReference(parentId);

    this._name = name;
    this._parentId = parentId;
  }

  private validateCircularReference(parentId?: string): void {
    if (this._id === parentId) {
      throw new DomainValidationError(
        '부모 카테고리를 자기 자신으로 설정할 수 없습니다',
      );
    }
  }

  public static create(props: CategoryCreateProps): Category {
    const id = generateId() as CategoryId;

    return new Category({
      id,
      name: props.name,
      parentId: props.parentId,
    });
  }

  updateName(name: string): Category {
    this.validateName(name);
    this._name = name;

    return this;
  }

  updateParentId(parentId?: string): Category {
    this.validateCircularReference(parentId);
    this._parentId = parentId;

    return this;
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new DomainValidationError('카테고리 이름은 필수입니다');
    }
    if (name.length > 50) {
      throw new DomainValidationError('카테고리 이름은 50자 이하여야 합니다');
    }
    if (/[~!@#$%^&*()_+={}[\]|\\;:"'<>,.?/]/.test(name)) {
      throw new DomainValidationError(
        '카테고리 이름에 특수 문자를 사용할 수 없습니다',
      );
    }
  }

  get id(): CategoryId {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get parentId(): string | undefined {
    return this._parentId;
  }
}

interface CategoryProps {
  id: CategoryId;
  name: string;
  parentId?: string | null;
}

interface CategoryCreateProps {
  name: string;
  parentId?: string | null;
}
