import { UserRoles } from '../models';

const getRolesFromRequest = (req: any) => {
  const tokenData = req.body.tokenData;
  if (!!tokenData && !!tokenData.roles && Array.isArray(tokenData.roles)) return tokenData.roles;
  return [];
};

export type WithRoles = { roles: UserRoles[] };

export const containsRole = (currentRoles: UserRoles[], ...roles: UserRoles[]) =>
  roles.every(x => currentRoles.indexOf(x) > -1);

export const isInRole = (user: WithRoles, ...roles: UserRoles[]) => containsRole(user.roles, ...roles);

export const isRootAdmin = (tokenData: WithRoles) => isInRole(tokenData, UserRoles.RootAdmin);

export const isUserAdmin = (tokenData: WithRoles, includeRootAdmin = true) =>
  isInRole(tokenData, UserRoles.UserAdmin) || (includeRootAdmin && isRootAdmin(tokenData));

export const isUser = (tokenData: WithRoles) => isInRole(tokenData, UserRoles.User);

export const requestHasRole = (req: { body: { tokenData: WithRoles } }, ...roles: UserRoles[]) => {
  const reqRoles = getRolesFromRequest(req);
  return containsRole(reqRoles, ...roles);
};
