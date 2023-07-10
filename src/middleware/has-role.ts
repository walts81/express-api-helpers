import { requestHasRole, sendUnauthorizedActionMsg } from '../helpers';
import { Middleware } from './middleware-type';
import { UserRoles } from '../models';
import { requireAuth } from './auth';
import { Request } from 'express';

const testAuth =
  (checkFn: (r: Request) => boolean): Middleware =>
  (req, res, next) =>
    requireAuth()(req, res, () => {
      if (checkFn(req)) {
        next();
      } else {
        return sendUnauthorizedActionMsg(res);
      }
    });

export const hasRole = (...roles: UserRoles[]) => testAuth(req => requestHasRole(req, ...roles));

export const hasAnyRole = (roles: UserRoles[]) => testAuth(req => roles.some(r => requestHasRole(req, r)));

export const hasUserRole = () => hasRole(UserRoles.User);

export const hasRootAdminRole = () => hasRole(UserRoles.RootAdmin);

export const hasUserAdminRole = (includeRootAdmin = true) =>
  testAuth(
    req => requestHasRole(req, UserRoles.UserAdmin) || (includeRootAdmin && requestHasRole(req, UserRoles.RootAdmin))
  );
