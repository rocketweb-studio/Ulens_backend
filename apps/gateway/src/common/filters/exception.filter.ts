import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponse } from '../types/types';
import { HttpStatuses } from '@libs/constants/index';



@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // this logic written for returnin name of the field where our mistake occurs
    if(status === HttpStatuses.BAD_REQUEST_400){
        const errorResponse: ErrorResponse  = {
            errorsMessages: []
        };
        const responseBody: any = exception.getResponse();

        if(responseBody.error){
            // Check if responseBody.message is an array
            if (Array.isArray(responseBody.message)) {
              responseBody.message.forEach((m) => {
                errorResponse.errorsMessages.push(m);
              });
            } else if (typeof responseBody.message === 'string') {
              // If it's a string, push it directly
              errorResponse.errorsMessages.push(responseBody.message);
            }


          //   responseBody.message.forEach((m) => {
          //   errorResponse.errorsMessages.push(m)
          // });
          response.status(status).json(errorResponse)
        }

        response.status(status).json()
    // ----------------------------------------------------
    }else{
        response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}