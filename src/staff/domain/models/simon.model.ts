import { generateId } from 'src/common/ddd/id.generator';
import { Branded } from 'src/common/types/branded';
import { PhoneNumber } from '../values/phone_number.vo';

export class Staff {
  private readonly _id: StaffId;
  private _name: string;
  private _phone: PhoneNumber;
  private _roles: Role[];
  private _status: StaffStatus;
  private _birthday: Date;
  private _email?: string;
  private _address?: string;
  private _note?: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

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

export const Role = {
  ADMIN: 'Admin',
  SALES_MANAGER: 'SalesManager',
  SALES_STAFF: 'SalesStaff',
  INVENTORY_MANAGER: 'InventoryManager',
  INVENTORY_STAFF: 'InventoryStaff',
  PURCHASE_MANAGER: 'PurchaseManager',
  PURCHASE_STAFF: 'PurchaseStaff',
  ACCOUNT_MANAGER: 'AccountManager',
  ACCOUNT_STAFF: 'AccountStaff',
};

export type Role = (typeof Role)[keyof typeof Role];

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
