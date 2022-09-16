import { QuoteRequest } from '@/models/QuoteRequest';
import { Quote } from '@/interfaces/quote.interface';
import { logger } from '@/utils/logger';
import { roundWithPrecision } from '@/utils/util';
import { Service } from 'typedi';
import { ExchangeRateService } from './exchange-rate.service';
import { LruCache } from './lru-cache.service';
import { HttpException } from '@/exceptions/HttpException';

@Service({ transient: true })
export class QuoteService {
  private EXCHANGE_RATE_PRECISION = 3;

  constructor(private exchangeRateService: ExchangeRateService, private lruCache: LruCache<string, number>) {}
  async calculateQuote(quoteRequest: QuoteRequest): Promise<Quote> {
    const exchangeRate = await this.getExchangeRate(quoteRequest);
    const roundedExchangeRate = roundWithPrecision(exchangeRate, this.EXCHANGE_RATE_PRECISION);
    const quoteAmount = Math.round(quoteRequest.baseAmount * roundedExchangeRate);
    return { exchangeRate: roundedExchangeRate, quoteAmount };
  }

  private async getExchangeRate(quoteRequest: QuoteRequest): Promise<number> {
    if (quoteRequest.baseCurrency === quoteRequest.quoteCurency) {
      return 1;
    }
    const cachedRate = this.lruCache.get(`${quoteRequest.baseCurrency}/${quoteRequest.quoteCurency}`);
    if (cachedRate) {
      logger.info(`${quoteRequest.baseCurrency} / ${quoteRequest.quoteCurency} exchange rate was found in cache.`);
      return cachedRate;
    } else {
      const exchangeRates = await this.exchangeRateService.retrieveExchangeRates(quoteRequest.baseCurrency);
      logger.info(`${quoteRequest.baseCurrency} / ${quoteRequest.quoteCurency} exchange rate was retrievd from API.`);

      exchangeRates.forEach((rate, currency) => {
        logger.debug(`Inserting ${quoteRequest.baseCurrency} / ${currency} rate into cache`);
        this.lruCache.put(`${quoteRequest.baseCurrency}/${currency}`, rate);
      });

      const rate = exchangeRates.get(quoteRequest.quoteCurency);
      if (rate) {
        return rate;
      } else {
        throw new HttpException(404, `Rate for exchage ${quoteRequest.baseCurrency} / ${quoteRequest.quoteCurency} not found`);
      }
    }
  }
}
