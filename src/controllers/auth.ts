import { Router, Response } from 'express';
import { generateToken, createUser, comparePassword } from '../helpers';
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
    if (typeof result === 'string') return res.badRequest({ message: result });
    return res.ok(result);
  });

  router.post('/login', async (req, res) => {
    const error = 'Username or password is invalid.';
    const user = req.body;
    const found = await findUserFn({ username: user.username });
    if (!found) return res.badRequest({ message: error });
    const valid = await comparePassword(user.password, found.hash);
    if (valid) {
      const token = generateToken(cleanUser(found));
      return res.ok(token);
    } else {
      return res.badRequest({ message: error });
    }
  });

  return { path: '/auth', router };
};
