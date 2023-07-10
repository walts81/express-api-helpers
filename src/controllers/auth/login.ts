import { Router } from 'express';
import { compareHash, generateToken } from '../../helpers';
import { User, cleanUser } from '../../models';
import { contactAdminMsg, maxAttemptsMsg, sendInvalidLoginMessage, sendRequiredMessage } from './auth-helpers';

export const addLoginRoute = (
  router: Router,
  findUserFn: (x: Partial<User>) => Promise<User>,
  updateUserFn: (id: string, x: Partial<User>) => Promise<any>
) => {
  router.post('/login', async (req, res) => {
    const user = req.body;
    if (!user.username) return sendRequiredMessage(res, 'Username');
    if (!user.password) return sendRequiredMessage(res, 'Password');

    const found = await findUserFn({ username: user.username });
    if (!found) return sendInvalidLoginMessage(res);
    if (found.disabled) return res.unauthorized({ message: 'User account has been disabled. ' + contactAdminMsg });
    if (found.invalidPasswordAttemptCount === found.invalidPasswordAttemptMax)
      return res.unauthorized({ message: maxAttemptsMsg });

    const valid = await compareHash(user.password, found.hash);
    if (!valid) {
      try {
        const id: string = (found as any)._id;
        const invalidPasswordAttemptCount = (found.invalidPasswordAttemptCount || 0) + 1;
        await updateUserFn(id, { invalidPasswordAttemptCount });
        if (invalidPasswordAttemptCount === found.invalidPasswordAttemptMax) {
          return sendInvalidLoginMessage(res, true);
        }
      } catch {}
      return sendInvalidLoginMessage(res);
    }

    const token = generateToken(cleanUser(found));
    return !!token ? res.ok(token) : res.serverError({ message: 'Failed to generate token.' });
  });
};
