import { Router } from 'express';
import { generateHash, isUserAdmin, sendUnauthorizedActionMsg } from '../../helpers';
import { hasRole } from '../../middleware';
import { User, UserRoles } from '../../models';
import { sendInvalidLoginMessage, sendRequiredMessage } from './auth-helpers';

export const addChangePasswordRoute = (
  router: Router,
  findUserFn: (x: Partial<User>) => Promise<User>,
  updateUserFn: (id: string, x: Partial<User>) => Promise<any>
) => {
  router.post('/change-password', hasRole(UserRoles.User), async (req, res) => {
    const user = req.body;
    if (!user.username) return sendRequiredMessage(res, 'Username');
    if (!user.password) return sendRequiredMessage(res, 'Password');

    const found = await findUserFn({ username: user.username });
    if (!found) return sendInvalidLoginMessage(res);

    const tokenData = req.body.tokenData;
    if (user.username !== tokenData.username && !isUserAdmin(tokenData)) return sendUnauthorizedActionMsg(res);

    const id: string = (found as any)._id;
    const hash = await generateHash(user.password);
    await updateUserFn(id, { hash });
  });
};
