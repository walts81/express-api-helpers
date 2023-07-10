import { Request, Response, NextFunction } from 'express';
import { UserRoles } from '../models';
import { authMiddleware } from './auth';

export const hasRole = (...roles: UserRoles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return authMiddleware(req, res, () => {
      const tokenData = req.body.tokenData;
      if (
        !!tokenData &&
        !!tokenData.roles &&
        Array.isArray(tokenData.roles) &&
        roles.some(x => tokenData.roles.indexOf(x) > -1)
      ) {
        next();
      } else {
        return res.unauthorized({ message: 'You are not authorized to perform this action.' });
      }
    });
  };
};
