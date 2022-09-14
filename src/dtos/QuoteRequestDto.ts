import { Currency } from '@/interfaces/quote.interface';
import { Type } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';

export class QuoteRequestDto {
  @IsEnum(Currency, { message: 'Invalid currency, supported currencies: USD, EUR, GBP, ILS' })
  baseCurrency: string;

  @IsEnum(Currency, { message: 'Invalid currency, supported currencies: USD, EUR, GBP, ILS' })
  quoteCurency: string;

  @IsInt()
  @Type(() => Number)
  baseAmount: number;
}
