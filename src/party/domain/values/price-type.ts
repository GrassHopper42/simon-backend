export const PriceType = {
  VAT_INCLUDED: 'vat_included',
  VAT_EXCLUDED: 'vat_excluded',
};

export type PriceType = (typeof PriceType)[keyof typeof PriceType];
