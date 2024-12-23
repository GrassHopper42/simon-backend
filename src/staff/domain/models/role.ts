import { Entity } from 'src/common/ddd/entity';
import { generateId } from 'src/common/ddd/id.generator';
import { Branded } from 'src/common/types/branded';
import { RolePolicy } from '../policies/role.policy';

export type RoleId = Branded<string, 'RoleId'>;

export class Role extends Entity<RoleId> {
  private readonly _code: string;
  private readonly _name: string;
  private readonly _description?: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(props: RoleProps) {
    super(props.id);

    const codeValidation = RolePolicy.validateCode(props.code);
    if (codeValidation.success === false) throw codeValidation.error;
    const nameValidation = RolePolicy.validateName(props.name);
    if (nameValidation.success === false) throw nameValidation.error;
    const descriptionValidation = RolePolicy.validateDescription(
      props.description,
    );
    if (descriptionValidation.success === false)
      throw descriptionValidation.error;

    this._code = codeValidation.value;
    this._name = nameValidation.value;
    this._description = descriptionValidation.value;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(props: RoleCreateProps): Role {
    const id = generateId() as RoleId;

    return new Role({
      id,
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static of(props: RoleProps): Role {
    return new Role(props);
  }

  public get code(): string {
    return this._code;
  }

  public get name(): string {
    return this._name;
  }

  public get description(): string | undefined {
    return this._description;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }
}

export interface RoleProps {
  id: RoleId;
  code: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleCreateProps {
  id: RoleId;
  code: string;
  name: string;
  description?: string;
}
