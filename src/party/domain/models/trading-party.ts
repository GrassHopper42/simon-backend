import { AggregateRoot } from 'src/common/ddd/aggregate-root';
import { PartyId } from '../values/party-id';
import { PartyStatus } from '../values/party-status';
import { PriceType } from '../values/price-type';

export class TradingParty extends AggregateRoot<PartyId> {
  public readonly basePartyId: PartyId;
  public readonly code: string;
  public readonly name: string;
  public readonly pricePolicy: string;
  public readonly priceType: PriceType;
  public readonly status: PartyStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: TradingPartyProps) {
    super(props.id);
  }

  public static create(props: TradingPartyCreateProps): TradingParty {
    return new TradingParty({
      ...props,
      id: PartyId.create(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

export interface TradingPartyProps {
  id: PartyId;
  basePartyId: PartyId;
  code: string;
  name: string;
  pricePolicy: string;
  priceType: PriceType;
  status: PartyStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface TradingPartyCreateProps {
  basePartyId: PartyId;
  code: string;
  name: string;
  pricePolicy: string;
  priceType: PriceType;
  status: PartyStatus;
}
