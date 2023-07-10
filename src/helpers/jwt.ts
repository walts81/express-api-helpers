import jwt from 'jsonwebtoken';
import { User, cleanUser } from '../models';

const getTokenConfig = () => {
  const secret = process.env.TOKEN_SECRET || '';
  const tokenExp = process.env.TOKEN_EXP || '1h';
  return { secret, tokenExp };
};

export const generateToken = (user: Partial<User>) => {
  const cUser = cleanUser(user);
  const config = getTokenConfig();
  const token = jwt.sign(cUser, config.secret, {
    expiresIn: config.tokenExp,
  });
  return token;
};

export const decryptToken = (token: string): Partial<User> | null => {
  const config = getTokenConfig();
  const result: Partial<User> = jwt.verify(token, config.secret) as any;
  return !!result.username ? result : null;
};
