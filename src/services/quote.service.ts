import { QuoteRequestDto } from '@/dtos/QuoteRequestDto';
import { Quote } from '@/interfaces/quote.interface';
import { Service } from 'typedi';
import ExchangeRateService from './exchange-rate.service';

@Service()
export default class QuoteService {
  constructor(private exchangeRateService: ExchangeRateService) {}
  async calculateQuote(quote: QuoteRequestDto): Promise<Quote> {
    const exchangeRate = await this.exchangeRateService.getExchangeRate(quote.baseCurrency, quote.quoteCurency);
    return { exchangeRate: exchangeRate, quoteAmount: 101 };
  }
}
