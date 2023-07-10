import { Request, Response } from 'express';
import { Middleware } from './middleware-type';
import { decryptToken } from '../helpers';

const sendUnathorized = (res: Response) => res.unauthorized({ message: 'Invalid auth token.' });

const getAuthToken = (req: Request) => {
  let token = '';
  const authHeader = req.headers.authorization;
  if (!!authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.slice(7).trim();
  }
  if (!token && !!req.query.apiKey) {
    token = req.query.apiKey.toString();
  }
  if (!token && !!req.query.apikey) {
    token = req.query.apikey.toString();
  }
  return token;
};

export const requireAuth: Middleware = (req, res, next) => {
  const token = getAuthToken(req);
  if (!!token) {
    try {
      const tokenData = decryptToken(token);
      if (!tokenData) return sendUnathorized(res);
      req.body.tokenData = tokenData;
      next();
    } catch (error) {
      return sendUnathorized(res);
    }
  } else {
    return sendUnathorized(res);
  }
};
