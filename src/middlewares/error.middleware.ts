import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/http-error.util';

export const errorHandler = (error: Error, req: Request, res: Response, _next: NextFunction): void => {
  const status = error instanceof HttpError ? error.statusCode : 500;
  const message = status === 500 ? 'Se produjo un error interno inesperado.' : error.message;
  const user = req?.session?.user ?? null;

  if (status === 500) {
    console.error('Unhandled error:', error);
  }

  if (!res || typeof res.status !== 'function') {
    console.error('Error sin contexto de respuesta:', error);
    return;
  }

  try {
    res.status(status).render('partials/error-page', {
      message,
      details: [],
      user,
    });
  } catch (renderError) {
    if (!res.headersSent) {
      res.status(status).send(message);
    }
    console.error('Fallo al renderizar error-page:', renderError);
  }
};