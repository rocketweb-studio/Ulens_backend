/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { CoreEnvConfig } from '@/core/core.config';
import { HttpStatuses } from '@libs/constants/http-statuses';
import { DefaultErrorResponse } from '@libs/constants/errors';

type ValidationErrorResponse = {
  errorsMessages: Array<{ field: string; message: string }>;
};

@Catch() // ловит все ошибки и передает в обработчик
export class GatewayExceptionFilter implements ExceptionFilter {
  constructor(private readonly coreConfig: CoreEnvConfig) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Обработка http ошибок
    if (exception instanceof HttpException) {
      const status = exception.getStatus?.() ?? HttpStatuses.INTERNAL_SERVER_ERROR_500;

      // Your 400 validation shape
      if (status === HttpStatuses.BAD_REQUEST_400) {
        const responseBody: any = exception.getResponse();
        if (responseBody?.error && Array.isArray(responseBody?.message)) {
          const errorResponse: ValidationErrorResponse = {
            errorsMessages: []
          };
          responseBody.message.forEach((m: any) => {
            errorResponse.errorsMessages.push(m);
          });
          return response.status(status).json(errorResponse);
        }
        return response.status(status).json(); // empty body as in your code
      }

      // Non-400
      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: this.coreConfig.env === 'production' ? 'Internal server error' : (this.safeMsg(exception) ?? 'Internal server error')
      } as DefaultErrorResponse);
    }

    // Обработка rpc ошибок которые приходят из микросервисов
    if (this.isRpcException(exception)) {
      const status = (exception as any).statusCode ?? HttpStatuses.INTERNAL_SERVER_ERROR_500;
      return response.status(status).json({
        statusCode: status,
        message: (exception as any).message ?? 'Internal server error',
        path: request.url,
        timestamp: new Date().toISOString()
      } as DefaultErrorResponse);
    }

    // Fallback для других транспортов (например, WS)
    return response.status(HttpStatuses.INTERNAL_SERVER_ERROR_500).json({
      statusCode: HttpStatuses.INTERNAL_SERVER_ERROR_500,
      message: 'Internal server error',
      path: request.url,
      timestamp: new Date().toISOString()
    } as DefaultErrorResponse);
  }

  // Безопасное получение сообщения из ошибки
  private safeMsg(e: any): string | undefined {
    return typeof e?.message === 'string' ? e.message : undefined;
  }

  // Проверяем является ли ошибка rpc ошибкой
  private isRpcException(exception: unknown): boolean {
    return !!exception && typeof exception === 'object' && ('statusCode' in exception || 'message' in exception);
  }
}
