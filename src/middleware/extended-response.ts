import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const send = (res: Response, statusCode: number, data?: any) => {
  const status = res.status(statusCode);
  if (!data) return status.send();
  else return status.send(data);
};

export const extendedResponse = (_: Request, res: Response, next: NextFunction) => {
  const anyRes = res as any;
  anyRes.ok = (data?: any) => send(res, StatusCodes.OK, data);
  anyRes.badRequest = (data?: any) => send(res, StatusCodes.BAD_REQUEST, data);
  anyRes.serverError = (data?: any) => send(res, StatusCodes.INTERNAL_SERVER_ERROR, data);
  anyRes.unauthorized = (data?: any) => send(res, StatusCodes.UNAUTHORIZED, data);
  next();
};
