import { Response } from 'express'

export const StatusCode = {
  OK: 200,
  CREATED: 201
}

export const ReasonStatusCode = {
  OK: 'OK!',
  CREATED: 'Created!'
}
class SuccessResponse {
  private status: number
  private message: string
  private metadata: any
  constructor({ status, message, metadata = {} }: { status: number; message: string; metadata?: any }) {
    this.status = status
    this.message = message
    this.metadata = metadata
  }

  send(res: Response, headers?: {}) {
    return res.status(this.status).json(this)
  }
}

export class Ok extends SuccessResponse {
  constructor({
    status = StatusCode.OK,
    message = ReasonStatusCode.OK,
    metadata = {}
  }: {
    status?: number
    message?: string
    metadata?: any
  }) {
    super({ status, message, metadata })
  }
}

export class Created extends SuccessResponse {
  constructor({
    status = StatusCode.CREATED,
    message = ReasonStatusCode.CREATED,
    metadata = {}
  }: {
    status?: number
    message?: string
    metadata?: any
  }) {
    super({ status, message, metadata })
  }
}
