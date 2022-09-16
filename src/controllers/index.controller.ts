import { QuoteRequest } from '@/models/QuoteRequest';
import { validationMiddleware } from '@/middlewares/validation.middleware';
import { Controller, Get, QueryParams, UseBefore } from 'routing-controllers';
import { QuoteService } from '@/services/quote.service';
import { Service } from 'typedi';
import { Quote } from '@/models/quote.interface';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
@Service()
@Controller()
export class IndexController {
  constructor(private quoteService: QuoteService) {}

  @Get('/health')
  @OpenAPI({
    description: 'Endpoint to check app health',
  })
  health() {
    return 'OK';
  }

  @Get('/quote')
  @OpenAPI({
    description: 'Endpoint to get quote for provided currencies',
  })
  @UseBefore(validationMiddleware(QuoteRequest, 'query'))
  async calculateQuote(@QueryParams() request: QuoteRequest) {
    return await this.quoteService.calculateQuote(request);
  }
}
