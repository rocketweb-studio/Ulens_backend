export type ErrorResponse = {
    errorsMessages: ErrorType[];
  }

export type ErrorType = {
    message: string
    field: string
}