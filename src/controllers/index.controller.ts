import { QuoteRequestDto } from '@/dtos/QuoteRequestDto';
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
  @UseBefore(validationMiddleware(QuoteRequestDto, 'query'))
  async calculateQuote(@QueryParams() request: QuoteRequestDto) {
    return this.quoteService.calculateQuote(request);
  }
}
