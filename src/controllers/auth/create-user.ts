import { Router } from 'express';
import { hasRole } from '../../middleware';
import { User, UserRoles } from '../../models';
import { sendRequiredMessage } from './auth-helpers';

export const addCreateUserRoute = (
  router: Router,
  findUserFn: (x: Partial<User>) => Promise<User>,
  insertUserFn: (x: Partial<User>) => Promise<any>
) => {
  router.post('/create-user', hasRole(UserRoles.UserAdmin, UserRoles.RootAdmin), async (req, res) => {
    const user = req.body;
    if (!user.username) return sendRequiredMessage(res, 'Username');
    if (!user.email) return sendRequiredMessage(res, 'Email');
    if (!user.password) return sendRequiredMessage(res, 'Password');

    const result = await addCreateUserRoute(user, findUserFn, insertUserFn);
    return typeof result === 'string' ? res.badRequest({ message: result }) : res.ok(result);
  });
};
