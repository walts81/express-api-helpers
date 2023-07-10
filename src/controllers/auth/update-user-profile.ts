import { Router } from 'express';
import { sendUnauthorizedActionMsg } from '../../helpers';
import { hasUserRole } from '../../middleware';
import { User } from '../../models';
import { checkForAdminPrivilege } from './auth-helpers';

export const addUserProfileRoute = (
  router: Router,
  findUserById: (id: string) => Promise<User>,
  updateUserFn: (id: string, x: Partial<User>) => Promise<any>
) => {
  const userRoute = router.route('/user/:id');
  userRoute.put(hasUserRole(), async (req, res) => {
    const id = req.params.id;
    const existing = await findUserById(id);
    if (!existing) return res.badRequest({ message: 'User not found.' });

    const tokenData = req.body.tokenData;
    const user = { ...req.body, tokenData: undefined };
    const userToUpdate: Partial<User> = { ...user };
    delete userToUpdate.hash;
    delete userToUpdate.username;
    delete userToUpdate.invalidPasswordAttemptMax;
    delete (userToUpdate as any).tokenData;

    if (!checkForAdminPrivilege(tokenData, existing, userToUpdate)) return sendUnauthorizedActionMsg(res);

    try {
      const result = await updateUserFn(id, userToUpdate);
      return res.ok(result);
    } catch (error) {
      return res.serverError({ message: error });
    }
  });
};
