import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware-type';

const send = (res: Response, statusCode: number, data?: any) => {
  const status = res.status(statusCode);
  return !!data ? status.send(data) : status.send();
};

export const responseHelpers = (): Middleware => (_, res, next) => {
  const anyRes = res as any;
  anyRes.badRequest = (data?: any) => send(res, StatusCodes.BAD_REQUEST, data);
  anyRes.forbidden = (data?: any) => send(res, StatusCodes.FORBIDDEN, data);
  anyRes.notFound = (data?: any) => send(res, StatusCodes.NOT_FOUND, data);
  anyRes.ok = (data?: any) => send(res, StatusCodes.OK, data);
  anyRes.serverError = (data?: any) => send(res, StatusCodes.INTERNAL_SERVER_ERROR, data);
  anyRes.serviceUnavailable = (data?: any) => send(res, StatusCodes.SERVICE_UNAVAILABLE, data);
  anyRes.unauthorized = (data?: any) => send(res, StatusCodes.UNAUTHORIZED, data);
  next();
};
