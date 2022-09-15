import { Type } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  ILS = 'ILS',
}

export class QuoteRequest {
  @IsEnum(Currency, { message: 'Invalid currency, supported currencies: USD, EUR, GBP, ILS' })
  baseCurrency: string;

  @IsEnum(Currency, { message: 'Invalid currency, supported currencies: USD, EUR, GBP, ILS' })
  quoteCurency: string;

  @IsInt()
  @Type(() => Number)
  baseAmount: number;
}
