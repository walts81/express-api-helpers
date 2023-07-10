import { User, cleanUser } from '../models';
import { hashPassword } from './hash';

export const createUser = async (
  user: Partial<User> & { password: string },
  findUserFn: (x: Partial<User>) => Promise<any>,
  insertUserFn: (x: Partial<User>) => Promise<any>
) => {
  try {
    const found = await findUserFn({ username: user.username });
    if (!!found) return 'Username already exists.';
    const hash = await hashPassword(user.password);
    const newUser: Partial<User> & { password?: string } = { ...user, hash };
    delete newUser.password;
    const result = await insertUserFn(newUser);
    return cleanUser(result);
  } catch (error) {
    return error as string;
  }
};
