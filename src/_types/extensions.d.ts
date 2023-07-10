import { Send } from 'express-serve-static-core';

declare global {
  namespace Express {
    export interface Response {
      badRequest(data?: any): Send<any, this>;
      forbidden(data?: any): Send<any, this>;
      notFound(data?: any): Send<any, this>;
      ok(data?: any): Send<any, this>;
      serverError(data?: any): Send<any, this>;
      serviceUnavailable(data?: any): Send<any, this>;
      unauthorized(data?: any): Send<any, this>;
    }
  }
}
