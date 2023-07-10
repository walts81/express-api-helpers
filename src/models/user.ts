import { Address } from './address';

export interface BasicUser {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: Address;
  roles?: string[];
}

export interface User extends BasicUser {
  hash: string;
  invalidPasswordAttemptCount?: number;
  invalidPasswordAttemptMax?: number;
  disabled?: boolean;
}

export const cleanUser = (user: Partial<User>): BasicUser => {
  const result = { ...user };
  delete result.hash;
  delete result.invalidPasswordAttemptCount;
  delete result.invalidPasswordAttemptMax;
  delete result.disabled;
  return result as any;
};
