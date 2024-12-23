import { generateId } from 'src/common/ddd/id.generator';
import { Branded } from 'src/common/types/branded';
import { PhoneNumber } from '../values/phone_number.vo';
import { Role } from './role';

export class Staff {
  private readonly _id: StaffId;
  private readonly _name: string;
  private readonly _phone: PhoneNumber;
  private readonly _roles: Role[];
  private readonly _status: StaffStatus;
  private readonly _birthday: Date;
  private readonly _email?: string;
  private readonly _address?: string; // 주소는 필수가 아니며, 사용자의 편의에 따라 일부 생략 가능하므로 별도의 유효성 검사 생략
  private readonly _note?: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  private constructor(props: StaffProps) {
    this._id = props.id;
    this._name = props.name;
    this._phone = props.phone;
    this._roles = props.roles;
    this._status = props.status;
    this._birthday = props.birthday;
    this._email = props.email;
    this._address = props.address;
    this._note = props.note;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(props: StaffCreateProps): Staff {
    const id = generateId() as StaffId;

    return new Staff({
      id,
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public updateInformation(props: StaffInfoProps): Staff {
    return new Staff({
      ...this.toStaffProps(),
      ...props,
      updatedAt: new Date(),
    });
  }

  public assignRole(role: Role): Staff {
    return new Staff({
      ...this.toStaffProps(),
      roles: [...this._roles, role],
      updatedAt: new Date(),
    });
  }

  public removeRole(role: Role): Staff {
    return new Staff({
      ...this.toStaffProps(),
      roles: this._roles.filter((r) => r !== role),
      updatedAt: new Date(),
    });
  }

  public activate(): Staff {
    return new Staff({
      ...this.toStaffProps(),
      status: StaffStatus.ACTIVE,
      updatedAt: new Date(),
    });
  }

  public deactivate(): Staff {
    return new Staff({
      ...this.toStaffProps(),
      status: StaffStatus.INACTIVE,
      updatedAt: new Date(),
    });
  }

  public delete(): Staff {
    return new Staff({
      ...this.toStaffProps(),
      status: StaffStatus.DELETED,
      updatedAt: new Date(),
    });
  }

  public static of(props: StaffProps): Staff {
    return new Staff(props);
  }

  public get id(): StaffId {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get phone(): PhoneNumber {
    return this._phone;
  }

  public get roles(): Role[] {
    return this._roles;
  }

  public get status(): StaffStatus {
    return this._status;
  }

  public get birthday(): Date {
    return this._birthday;
  }

  public get email(): string | undefined {
    return this._email;
  }

  public get address(): string | undefined {
    return this._address;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get updatedAt(): Date {
    return this._updatedAt;
  }

  public updateName(newName?: string): Staff {
    if (!newName) return this;

    return new Staff({
      ...this.toStaffProps(),
      name: newName,
      updatedAt: new Date(),
    });
  }

  private toStaffProps(): StaffProps {
    return {
      id: this.id,
      name: this.name,
      phone: this.phone,
      roles: this.roles,
      status: this.status,
      birthday: this.birthday,
      email: this.email,
      address: this.address,
      note: this._note,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}

export type StaffId = Branded<string, 'StaffId'>;

export const StaffStatus = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DELETED: 'Deleted',
};

export type StaffStatus = (typeof StaffStatus)[keyof typeof StaffStatus];

export interface StaffCreateProps {
  name: string;
  phone: PhoneNumber;
  roles: Role[];
  status: StaffStatus;
  birthday: Date;
  email?: string;
  address?: string;
  note?: string;
}

export interface StaffProps {
  id: StaffId;
  name: string;
  phone: PhoneNumber;
  roles: Role[];
  status: StaffStatus;
  birthday: Date;
  email?: string;
  address?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StaffInfoProps {
  name?: string;
  phone?: PhoneNumber;
  email?: string;
  address?: string;
  note?: string;
}
