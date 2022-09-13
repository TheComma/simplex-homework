import request from 'supertest';
import App from '../app';
import { IndexController } from '../controllers/index.controller';
import axios from 'axios';

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
    });

    it('response statusCode 200 when sending a valid quote request', () => {
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

      mockedAxios.get.mockResolvedValue(getResponse);

      const app = new App([IndexController]);

      return request(app.getServer())
        .get('/quote?baseCurrency=USD&quoteCurency=EUR&baseAmount=100')
        .expect(200, { exchangeRate: 1.01, quoteAmount: 101 });
    });

    it('response statusCode 503 if there is trouble with exchage rate', () => {
      const getResponse = {
        status: 500,
        message: 'Internal Server Error',
      };

      mockedAxios.get.mockRejectedValue(getResponse);

      const app = new App([IndexController]);

      return request(app.getServer()).get('/quote?baseCurrency=USD&quoteCurency=EUR&baseAmount=100').expect(503);
    });

    it('response statusCode 400 when sending invalid quote request', () => {
      const app = new App([IndexController]);

      return request(app.getServer()).get('/quote?baseCurrency=RUB&quoteCurency=EUR&baseAmount=100').expect(400);
    });
  });
});
