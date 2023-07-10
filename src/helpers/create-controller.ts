import { NextFunction, Request, Response, Router } from 'express';
import { Crud, UserRoles } from '../models';
import { hasRole } from '../middleware';

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

const tryExecute = (req: Request, res: Response, action: (r1: Request, r2: Response) => Promise<any>) => {
  try {
    return action(req, res);
  } catch (error) {
    return res.serverError({ message: error });
  }
};
export const createControllerWithMiddlewareForRoles = <T>(
  name: string,
  path: string,
  crud: Crud<T>,
  cleanFn: (a: T) => any = x => x,
  middleware: Middleware[],
  roles: UserRoles[]
) => {
  const router = Router();

  const pluralRoute = router.route('/');
  const cleanFnToUse = cleanFn || (x => x);

  const middlewareToUse = middleware || [];
  if (!!roles && roles.length > 0) middlewareToUse.unshift(hasRole(...roles));

  pluralRoute.get(...middlewareToUse, (req, res) => {
    return tryExecute(req, res, async (_, r2) => {
      const objs = await crud.find({});
      return r2.ok(objs.map(cleanFnToUse));
    });
  });

  pluralRoute.post(...middlewareToUse, (req, res) => {
    return tryExecute(req, res, async (r1, r2) => {
      const newObj = r1.body;
      await crud.insert(newObj);
      return r2.ok({ message: `New ${name} inserted.` });
    });
  });

  const singleRoute = router.route('/:id');

  singleRoute.get(...middlewareToUse, (req, res) => {
    return tryExecute(req, res, async (r1, r2) => {
      const obj = await crud.findById(r1.params.id);
      if (!obj) return r2.badRequest({ message: `No ${name} found for id: ${req.params.id}` });
      else return r2.ok(cleanFnToUse(obj));
    });
  });

  singleRoute.put(...middlewareToUse, (req, res) => {
    return tryExecute(req, res, async (r1, r2) => {
      const updatedObj = r1.body;
      await crud.update(r1.params.id, updatedObj);
      return r2.ok({ message: `${name} updated.` });
    });
  });

  singleRoute.delete(...middlewareToUse, (req, res) => {
    return tryExecute(req, res, async (r1, r2) => {
      await crud.delete(r1.params.id);
      return r2.ok({ message: `${name} removed.` });
    });
  });

  return { path, router };
};

export const createControllerWithMiddleware = <T>(
  name: string,
  path: string,
  crud: Crud<T>,
  cleanFn: (x: T) => any = x => x,
  ...middleware: Middleware[]
) => createControllerWithMiddlewareForRoles(name, path, crud, cleanFn, middleware, []);

export const createControllerForRoles = <T>(
  name: string,
  path: string,
  crud: Crud<T>,
  cleanFn: (x: T) => any = x => x,
  ...roles: UserRoles[]
) => createControllerWithMiddlewareForRoles(name, path, crud, cleanFn, [], roles);

export const createController = <T>(name: string, path: string, crud: Crud<T>, cleanFn: (x: T) => any = x => x) =>
  createControllerWithMiddlewareForRoles(name, path, crud, cleanFn, [], []);
