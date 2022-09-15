import { HttpException } from '@/exceptions/HttpException';
import axios from 'axios';
import { Service } from 'typedi';
import { EXCHANGE_RATE_API_URL } from '@/config/index';
import { Currency } from '@/models/QuoteRequest';

@Service({ transient: true })
export class ExchangeRateService {
  public async retrieveExchangeRates(baseCurrency: string): Promise<Map<string, number>> {
    const resp = await axios
      .get<ExchangeRateResponse>(EXCHANGE_RATE_API_URL + baseCurrency)
      .then(resp => resp.data)
      .catch(err => {
        throw new HttpException(503, err.message, 'Service is unavailable. Please try again later.');
      });

    const result: Map<string, number> = new Map<string, number>();
    Object.keys(Currency).forEach(curr => {
      if (resp.rates[curr]) {
        result.set(curr, resp.rates[curr]);
      }
    });

    return result;
  }
}

interface ExchangeRateResponse {
  date: string;
  time_last_updated: number;
  rates: Record<string, number>;
}
