import { HttpStatuses } from './http-statuses';

export type DefaultErrorResponse = {
  statusCode: HttpStatuses;
  timestamp: string;
  path: string;
  message: string;
};
