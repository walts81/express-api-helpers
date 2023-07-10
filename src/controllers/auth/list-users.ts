import { Router } from 'express';
import { User } from '../../models';
import { hasUserAdminRole } from '../../middleware';

export const addListUsersRoute = (router: Router, findUsersFn: (x: Partial<User>) => Promise<User[]>) => {
  const usersRoute = router.route('/users');
  usersRoute.get(hasUserAdminRole(), async (req, res) => {
    try {
      const body = { ...req.body, tokenData: undefined };
      const query = { ...body };
      const result = await findUsersFn(query);
      return res.ok(result);
    } catch (error) {
      return res.serverError({ message: error });
    }
  });
};
