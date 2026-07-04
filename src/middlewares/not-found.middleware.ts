import { Request, Response } from 'express';

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).render('partials/error-page', {
    message: 'Recurso no encontrado.',
    details: [],
    user: null,
  });
};