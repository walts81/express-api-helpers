import { Middleware } from './middleware-type';
import { UserRoles } from '../models';
import { requireAuth } from './auth';

export const hasRole =
  (...roles: UserRoles[]): Middleware =>
  (req, res, next) =>
    requireAuth(req, res, () => {
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
