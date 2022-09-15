import { QuoteRequest } from '@/models/QuoteRequest';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import { Controller, Get, QueryParams, UseBefore } from 'routing-controllers';
import { QuoteService } from '@/services/quote.service';
import { Service } from 'typedi';
@Service()
@Controller()
export class IndexController {
  constructor(private quoteService: QuoteService) {}

  @Get('/health')
  health() {
    return 'OK';
  }

  @Get('/quote')
  @UseBefore(validationMiddleware(QuoteRequest, 'query'))
  async calculateQuote(@QueryParams() request: QuoteRequest) {
    return this.quoteService.calculateQuote(request);
  }
}
