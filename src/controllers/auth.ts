import { Router, Response } from 'express';
import { generateToken, createUser, compareHash } from '../helpers';
import { hasRole } from '../middleware';
import { User, cleanUser, UserRoles } from '../models';

export const getAuthController = (
  findUserFn: (x: Partial<User>) => Promise<any>,
  insertUserFn: (x: Partial<User>) => Promise<any>
) => {
  const router = Router();

  const sendRequiredMessage = (res: Response, field: string) => res.badRequest({ message: `${field} is required.` });

  router.post('/create-user', hasRole(UserRoles.UserAdmin, UserRoles.RootAdmin), async (req, res) => {
    const user = req.body;
    if (!user.username) return sendRequiredMessage(res, 'Username');
    if (!user.email) return sendRequiredMessage(res, 'Email');
    if (!user.password) return sendRequiredMessage(res, 'Password');
    const result = await createUser(user, findUserFn, insertUserFn);
    return typeof result === 'string' ? res.badRequest({ message: result }) : res.ok(result);
  });

  const sendInvalidLoginMessage = (res: Response) => res.badRequest({ message: 'Username or password is invalid.' });

  router.post('/login', async (req, res) => {
    const user = req.body;
    const found = await findUserFn({ username: user.username });
    if (!found) return sendInvalidLoginMessage(res);

    const valid = await compareHash(user.password, found.hash);
    if (!valid) return sendInvalidLoginMessage(res);

    const token = generateToken(cleanUser(found));
    return !!token ? res.ok(token) : res.serverError({ message: 'Failed to generate token.' });
  });

  return { path: '/auth', router };
};
