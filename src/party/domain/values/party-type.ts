export const PartyType = {
  INDIVIDUAL: 'individual',
  ORGANIZATION: 'organization',
};

export type PartyType = (typeof PartyType)[keyof typeof PartyType];
