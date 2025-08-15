import { ApiResponseOptions } from '@nestjs/swagger';

export const IncorrectInputDataResponse: ApiResponseOptions = {
  status: 400,
  description: 'Incorrect input data',
  schema: {
    example: {
      statusCode: 400,
      messages: [
        {
          message: 'Email must be a valid email address',
          field: 'email',
        },
      ],
      error: 'Bad Request',
    },
  },
};