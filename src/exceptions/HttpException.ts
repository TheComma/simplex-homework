import { HttpError } from 'routing-controllers';

export class HttpException extends HttpError {
  public status: number;
  public message: string;
  public resultMessage?: string;

  constructor(status: number, message: string, resultMessage?: string) {
    super(status, message);
    this.status = status;
    this.message = message;
    this.resultMessage = resultMessage;
  }
}
