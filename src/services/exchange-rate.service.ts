import { HttpException } from '@/exceptions/HttpException';
import axios from 'axios';
import { Service } from 'typedi';

@Service()
export default class ExchangeRateService {
  private EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.com/v4/latest/';

  public async getExchangeRate(baseCurrency: string, quoteCurrency: string): Promise<number> {
    const resp = await axios
      .get<ExchangeRateResponse>(this.EXCHANGE_RATE_API_URL + baseCurrency)
      .then(resp => resp.data)
      .catch(err => {
        throw new HttpException(503, err.message, 'Service is unavailable. Please try again later.');
      });

    if (resp.rates[quoteCurrency]) {
      return resp.rates[quoteCurrency];
    } else {
      throw new HttpException(404, 'Quote not found');
    }
  }
}

interface ExchangeRateResponse {
  date: string;
  time_last_updated: number;
  rates: Record<string, number>;
}
