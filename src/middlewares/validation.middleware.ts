import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const handleValidation = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
    return;
  }

  res.status(400).render('partials/error-page', {
    message: 'Hay errores de validacion en la solicitud.',
    details: errors.array().map((error) => error.msg),
    user: req.session.user,
  });
};