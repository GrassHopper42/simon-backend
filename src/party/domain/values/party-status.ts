export const PartyStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

export type PartyStatus = (typeof PartyStatus)[keyof typeof PartyStatus];
