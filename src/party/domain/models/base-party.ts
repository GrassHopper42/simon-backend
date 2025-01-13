import { Entity } from 'src/common/ddd/entity';
import { PartyId } from '../values/party-id';
import { PartyType } from '../values/party-type';

export class BaseParty extends Entity<PartyId> {
  public readonly code: string;
  public readonly name: string;
  public readonly type: PartyType;
  public readonly phone: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public readonly alias?: string;
  public readonly address?: string;
  public readonly email?: string;
  public readonly businessNumber?: string;
  public readonly businessType?: string;
  public readonly note?: string;

  private constructor(props: PartyProps) {
    super(props.id);
  }

  public static create(props: PartyCreateProps): BaseParty {
    return new BaseParty({
      ...props,
      id: PartyId.create(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static of(props: PartyProps): BaseParty {
    return new BaseParty(props);
  }
}

export interface PartyProps {
  id: PartyId;
  code: string;
  name: string;
  type: PartyType;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  alias?: string;
  address?: string;
  email?: string;
  businessNumber?: string;
  businessType?: string;
  note?: string;
}

export interface PartyCreateProps {
  code: string;
  name: string;
  type: PartyType;
  phone: string;
  alias?: string;
  address?: string;
  email?: string;
  businessNumber?: string;
  businessType?: string;
  note?: string;
}
