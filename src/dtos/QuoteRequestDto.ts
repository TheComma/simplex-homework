import { Currency } from '@/interfaces/quote.interface';
import { IsEnum, IsString } from 'class-validator';

export class QuoteRequestDto {
  @IsEnum(Currency, { message: 'Invalid currency, supported currencies: USD, EUR, GBP, ILS' })
  baseCurrency: string;

  @IsEnum(Currency, { message: 'Invalid currency, supported currencies: USD, EUR, GBP, ILS' })
  quoteCurency: string;

  @IsString()
  baseAmount: string;
}
