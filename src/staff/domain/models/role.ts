export class Role {
  private readonly _code: string;
  private readonly _name: string;
  private readonly _description?: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(props: RoleProps) {
    const validatedCode = this.validateCode(props.code);
    const validatedName = this.validateName(props.name);

    this._code = validatedCode;
    this._name = validatedName;
    this._description = props.description;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(props: RoleCreateProps): Role {
    return new Role({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static of(props: RoleProps): Role {
    return new Role(props);
  }

  private validateCode(code: string): string {
    if (!/^[A-Z0-9]+$/.test(code)) {
      throw new Error('코드는 대문자와 숫자로만 이루어져야 합니다.');
    }
    if (code.length < 3 || code.length > 50) {
      throw new Error('코드는 3자 이상 50자 이하여야 합니다.');
    }

    return code;
  }

  private validateName(name: string): string {
    if (name.length < 3 || name.length > 50) {
      throw new Error('이름은 3자 이상 50자 이하여야 합니다.');
    }

    return name;
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
  code: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoleCreateProps {
  code: string;
  name: string;
  description?: string;
}
