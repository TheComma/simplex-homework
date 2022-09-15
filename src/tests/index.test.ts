import request from 'supertest';
import App from '../app';
import { IndexController } from '../controllers/index.controller';
import axios from 'axios';
import { ExchangeRateService } from '../services/exchange-rate.service';
import Container from 'typedi';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Testing Index', () => {
  describe('[GET] /health', () => {
    it('response statusCode 200 when checking status health', () => {
      const app = new App([IndexController]);

      return request(app.getServer()).get('/health').expect(200);
    });
  });

  describe('[GET] /quote', () => {
    afterEach(() => {
      jest.resetAllMocks();
      Container.reset();
    });

    test('response statusCode 200 when sending a valid quote request', () => {
      const getResponse = {
        status: 200,
        data: {
          date: '2022-01-01',
          time_last_updated: 1,
          rates: {
            EUR: 1.01,
          },
        },
      };

      mockedAxios.get.mockResolvedValueOnce(getResponse);

      const app = new App([IndexController]);

      return request(app.getServer())
        .get('/quote?baseCurrency=USD&quoteCurency=EUR&baseAmount=100')
        .expect(200, { exchangeRate: 1.01, quoteAmount: 101 });
    });

    test('response statusCode 503 if there is trouble with exchage rate', () => {
      const getResponse = {
        status: 500,
        message: 'Internal Server Error',
      };

      mockedAxios.get.mockRejectedValueOnce(getResponse);

      const app = new App([IndexController]);

      return request(app.getServer()).get('/quote?baseCurrency=USD&quoteCurency=EUR&baseAmount=100').expect(503);
    });

    test('response statusCode 400 when sending invalid quote request', () => {
      const app = new App([IndexController]);

      return request(app.getServer()).get('/quote?baseCurrency=RUB&quoteCurency=EUR&baseAmount=100').expect(400);
    });

    test('response statusCode 200 and exchange service called once after requesting 2 different USD requests', async () => {
      const getResponse = {
        status: 200,
        data: {
          date: '2022-01-01',
          time_last_updated: 1,
          rates: {
            EUR: 1.01,
            GBP: 1.02,
          },
        },
      };

      mockedAxios.get.mockResolvedValue(getResponse);

      const exchangeService = jest.spyOn(ExchangeRateService.prototype, 'retrieveExchangeRates');

      const app = new App([IndexController]);
      const server = app.getServer();

      await request(server).get('/quote?baseCurrency=USD&quoteCurency=EUR&baseAmount=100').expect(200, { exchangeRate: 1.01, quoteAmount: 101 });

      await request(server).get('/quote?baseCurrency=USD&quoteCurency=GBP&baseAmount=100').expect(200, { exchangeRate: 1.02, quoteAmount: 102 });

      return expect(exchangeService).toHaveBeenCalledTimes(1);
    });

    test('response statusCode 200 and not to hit cache after requesting USD then EUR then USD again', async () => {
      const getResponse = {
        status: 200,
        data: {
          date: '2022-01-01',
          time_last_updated: 1,
          rates: {
            EUR: 1.01,
            GBP: 1.02,
            ILS: 1.03,
          },
        },
      };

      mockedAxios.get.mockResolvedValue(getResponse);

      const exchangeService = jest.spyOn(ExchangeRateService.prototype, 'retrieveExchangeRates');

      const app = new App([IndexController]);
      const server = app.getServer();

      await request(server).get('/quote?baseCurrency=USD&quoteCurency=EUR&baseAmount=100').expect(200, { exchangeRate: 1.01, quoteAmount: 101 });

      await request(server).get('/quote?baseCurrency=EUR&quoteCurency=ILS&baseAmount=100').expect(200, { exchangeRate: 1.03, quoteAmount: 103 });

      await request(server).get('/quote?baseCurrency=USD&quoteCurency=GBP&baseAmount=100').expect(200, { exchangeRate: 1.02, quoteAmount: 102 });

      return expect(exchangeService).toHaveBeenCalledTimes(3);
    });
  });
});
