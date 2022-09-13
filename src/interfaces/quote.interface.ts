export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  ILS = 'ILS',
}

export interface Quote {
  exchangeRate: number;
  quoteAmount: number;
}
