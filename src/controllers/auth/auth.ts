import { Router } from 'express';
import { User } from '../../models';
import { addCreateUserRoute } from './create-user';
import { addLoginRoute } from './login';
import { addChangePasswordRoute } from './change-password';
import { addUserProfileRoute } from './update-user-profile';
import { addListUsersRoute } from './list-users';

export const getAuthController = (
  findUserById: (id: string) => Promise<User>,
  findUserFn: (x: Partial<User>) => Promise<User>,
  findUsersFn: (x: Partial<User>) => Promise<User[]>,
  insertUserFn: (x: Partial<User>) => Promise<any>,
  updateUserFn: (id: string, x: Partial<User>) => Promise<any>
) => {
  const router = Router();

  addCreateUserRoute(router, findUserFn, insertUserFn);
  addLoginRoute(router, findUserFn, updateUserFn);
  addChangePasswordRoute(router, findUserFn, updateUserFn);
  addUserProfileRoute(router, findUserById, updateUserFn);
  addListUsersRoute(router, findUsersFn);

  return { path: '/auth', router };
};
