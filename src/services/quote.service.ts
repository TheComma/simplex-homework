import { QuoteRequestDto } from '@/dtos/QuoteRequestDto';
import { Quote } from '@/interfaces/quote.interface';
import { Service } from 'typedi';

@Service()
export default class QuoteService {
  calculateQuote(quote: QuoteRequestDto): Quote {
    return { exchangeRate: 1.01, quoteAmount: 101 };
  }
}
