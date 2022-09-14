import { QuoteRequestDto } from '@/dtos/QuoteRequestDto';
import { Quote } from '@/interfaces/quote.interface';
import { logger } from '@/utils/logger';
import { roundWithPrecision } from '@/utils/util';
import { Service } from 'typedi';
import { ExchangeRateService } from './exchange-rate.service';
import lruCache from './lru-cache.service';

@Service()
export class QuoteService {
  private EXCHANGE_RATE_PRECISION = 3;

  constructor(private exchangeRateService: ExchangeRateService) {}
  async calculateQuote(quoteRequest: QuoteRequestDto): Promise<Quote> {
    const exchangeRate = await this.getExchangeRate(quoteRequest);
    const roundedExchangeRate = roundWithPrecision(exchangeRate, this.EXCHANGE_RATE_PRECISION);
    const quoteAmount = Math.round(quoteRequest.baseAmount * roundedExchangeRate);
    return { exchangeRate: roundedExchangeRate, quoteAmount };
  }

  private async getExchangeRate(quoteRequest: QuoteRequestDto): Promise<number> {
    const cachedRate = lruCache.get([quoteRequest.baseCurrency, quoteRequest.quoteCurency]);
    if (cachedRate) {
      logger.info(`${quoteRequest.baseCurrency} / ${quoteRequest.quoteCurency} exchange rate was found in cache.`);
      return cachedRate;
    } else {
      const exchangeRate = await this.exchangeRateService.retrieveExchangeRate(quoteRequest.baseCurrency, quoteRequest.quoteCurency);
      logger.info(`${quoteRequest.baseCurrency} / ${quoteRequest.quoteCurency} exchange rate was retrievd from API. Inserting into cache.`);
      lruCache.put([quoteRequest.baseCurrency, quoteRequest.quoteCurency], exchangeRate);
      return exchangeRate;
    }
  }
}
