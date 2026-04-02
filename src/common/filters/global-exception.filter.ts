import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
  method: string;
  timestamp: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message: string | string[] =
      'An unexpected error occurred. Please try again later.';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseBody = exceptionResponse as {
          error?: string;
          message?: string | string[];
        };

        error = responseBody.error ?? exception.name;
        message = responseBody.message ?? exception.message;
      } else {
        message = exception.message;
      }
    }

    const exceptionName =
      exception instanceof Error ? exception.name : 'UnknownError';
    const exceptionMessage =
      exception instanceof Error ? exception.message : String(exception);

    this.logger.error(
      `${request.method} ${request.url} -> ${statusCode} ${error}: ${exceptionName} - ${exceptionMessage}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const responseBody: ApiErrorResponse = {
      statusCode,
      error,
      message,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    };

    response.status(statusCode).json(responseBody);
  }
}
