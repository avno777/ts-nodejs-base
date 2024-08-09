import { Request } from 'express'
export interface IRequest extends Request {
  query: {
    [key: string]: string
  }
  body: {
    [key: string]: any
  }
  user?: {
    _id: string
  }
}
