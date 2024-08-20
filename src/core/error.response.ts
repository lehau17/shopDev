export const StatusCode = {
  CONFLICT: '409',
  BAD_REQUEST: '400',
  AUTHENTICATE: '401',
  NOT_FOUND: '404',
  FORBIDDEN: '403'
}

export const ReasonStatusCode = {
  CONFLICT: 'ConfigError',
  BAD_REQUEST: 'Bad request error',
  AUTHENTICATE: 'Auth error',
  NOT_FOUND: 'Not found',
  FORBIDDEN: 'Not role'
}

export class ErrorResponse extends Error {
  private status: string
  private statusCode: string | number
  constructor(message: string, statusCode: string | number, status = 'error') {
    super(message)
    this.statusCode = statusCode
    this.status = status
  }
}

export class ConfigResponse extends ErrorResponse {
  constructor({
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT
  }: {
    message?: string
    statusCode?: string | number
  }) {
    super(message, statusCode)
  }
}

export class BadRequestResponse extends ErrorResponse {
  constructor({
    message = ReasonStatusCode.BAD_REQUEST,
    statusCode = StatusCode.BAD_REQUEST
  }: {
    message?: string
    statusCode?: string | number
  }) {
    super(message, statusCode)
  }
}

export class AuthenticationFailureResponse extends ErrorResponse {
  constructor({
    message = ReasonStatusCode.AUTHENTICATE,
    statusCode = StatusCode.AUTHENTICATE
  }: {
    message?: string
    statusCode?: string | number
  }) {
    super(message, statusCode)
  }
}

export class NotFoundResponse extends ErrorResponse {
  constructor({
    message = ReasonStatusCode.NOT_FOUND,
    statusCode = StatusCode.NOT_FOUND
  }: {
    message?: string
    statusCode?: string | number
  }) {
    super(message, statusCode)
  }
}

export class ForbiddenResponse extends ErrorResponse {
  constructor({
    message = ReasonStatusCode.FORBIDDEN,
    statusCode = StatusCode.FORBIDDEN
  }: {
    message?: string
    statusCode?: string | number
  }) {
    super(message, statusCode)
  }
}
