import { Response } from 'express';
import { WithRoles, isUserAdmin } from '../../helpers';
import { User } from '../../models';

export const sendRequiredMessage = (res: Response, field: string) =>
  res.badRequest({ message: `${field} is required.` });

export const contactAdminMsg = 'Please contact an administrator.';
export const maxAttemptsMsg = 'Max invalid login attempts exceeded. ' + contactAdminMsg;
export const sendInvalidLoginMessage = (res: Response, maxAttempts = false) =>
  res.badRequest({
    message: ('Username or password is invalid. ' + (maxAttempts ? maxAttemptsMsg : '')).trim(),
  });

const checkPropForAdminPrivilege = (tokenData: WithRoles, currentProp: any, updatedProp: any) => {
  let shouldCheckForAdmin = false;
  if (updatedProp !== undefined && updatedProp !== currentProp) {
    if (Array.isArray(currentProp)) {
      const arr1 = Array(currentProp);
      const arr2 = Array(updatedProp);
      if (arr1.length !== arr2.length || arr1.some(x => arr2.indexOf(x) < 0) || arr2.some(x => arr1.indexOf(x) < 0)) {
        shouldCheckForAdmin = true;
      }
    } else if (typeof currentProp === 'object') {
      for (const p in currentProp) {
        if (currentProp[p] !== updatedProp[p]) {
          shouldCheckForAdmin = true;
          break;
        }
      }
    } else {
      shouldCheckForAdmin = true;
    }
  }
  return !shouldCheckForAdmin || isUserAdmin(tokenData);
};

export const checkForAdminPrivilege = (
  tokenData: WithRoles,
  currentUser: Partial<User>,
  updatedUser: Partial<User>
) => {
  const privilegedDataPairs = [
    { a: currentUser.invalidPasswordAttemptCount, b: updatedUser.invalidPasswordAttemptCount },
    { a: currentUser.disabled, b: updatedUser.disabled },
    { a: currentUser.roles, b: updatedUser.roles },
  ];
  for (const dataPair of privilegedDataPairs) {
    if (!checkPropForAdminPrivilege(tokenData, dataPair.a, dataPair.b)) {
      return false;
    }
  }
  return true;
};
