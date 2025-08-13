import { RpcException } from '@nestjs/microservices';

export enum RpcExceptionDefaultMessages {
  NOT_FOUND = 'Not found',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  INTERNAL_SERVER_ERROR = 'Internal server error',
  TOO_MANY_REQUESTS = 'Too many requests'
}

export class BaseRpcException extends RpcException {
  constructor(statusCode: number, message: string) {
    super({ statusCode, message });
  }
}

export class NotFoundRpcException extends BaseRpcException {
  constructor(message: string = RpcExceptionDefaultMessages.NOT_FOUND) {
    super(404, message);
  }
}

export class UnauthorizedRpcException extends BaseRpcException {
  constructor(message: string = RpcExceptionDefaultMessages.UNAUTHORIZED) {
    super(401, message);
  }
}

export class ForbiddenRpcException extends BaseRpcException {
  constructor(message: string = RpcExceptionDefaultMessages.FORBIDDEN) {
    super(403, message);
  }
}

export class TooManyRequestsRpcException extends BaseRpcException {
  constructor(message: string = RpcExceptionDefaultMessages.TOO_MANY_REQUESTS) {
    super(429, message);
  }
}

export class UnexpectedErrorRpcException extends BaseRpcException {
  constructor(message: string = RpcExceptionDefaultMessages.INTERNAL_SERVER_ERROR) {
    super(500, message);
  }
}
