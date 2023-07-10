import { Response } from 'express';

export const sendUnauthorizedActionMsg = (res: Response) =>
  res.unauthorized({ message: 'You are not authorized to perform this action.' });
