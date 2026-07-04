import { body } from 'express-validator';

export const loginValidator = [
  body('usernameOrEmail').trim().notEmpty().withMessage('Usuario o email es obligatorio.'),
  body('password').notEmpty().withMessage('Contrasena es obligatoria.'),
];