import { body } from 'express-validator';

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;

export const createUserValidator = [
  body('fullName').trim().notEmpty().withMessage('Nombre completo es obligatorio.'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Usuario es obligatorio.')
    .matches(USERNAME_PATTERN)
    .withMessage('Usuario solo puede contener letras, numeros, punto, guion y guion bajo.'),
  body('email').trim().isEmail().withMessage('Email invalido.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Contrasena debe tener al menos 6 caracteres.'),
  body('roleId').trim().notEmpty().withMessage('Rol es obligatorio.'),
  body('isActive').optional().isIn(['on']).withMessage('Estado invalido.'),
];

export const updateUserValidator = [
  body('fullName').trim().notEmpty().withMessage('Nombre completo es obligatorio.'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Usuario es obligatorio.')
    .matches(USERNAME_PATTERN)
    .withMessage('Usuario solo puede contener letras, numeros, punto, guion y guion bajo.'),
  body('email').trim().isEmail().withMessage('Email invalido.').normalizeEmail(),
  body('password').optional({ values: 'falsy' }).isLength({ min: 6 }).withMessage('Contrasena minima: 6.'),
  body('roleId').trim().notEmpty().withMessage('Rol es obligatorio.'),
  body('isActive').optional().isIn(['on']).withMessage('Estado invalido.'),
];

export const updateUserSecurityValidator = [
  body('roleId').trim().notEmpty().withMessage('Rol es obligatorio.'),
  body('isActive').optional().isIn(['on']).withMessage('Estado invalido.'),
];

export const createRoleValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nombre del rol es obligatorio.')
    .isLength({ min: 3, max: 30 })
    .withMessage('Nombre del rol debe tener entre 3 y 30 caracteres.'),
  body('description').optional({ values: 'falsy' }).trim().isLength({ max: 150 }),
];

export const updateRoleValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nombre del rol es obligatorio.')
    .isLength({ min: 3, max: 30 })
    .withMessage('Nombre del rol debe tener entre 3 y 30 caracteres.'),
  body('description').optional({ values: 'falsy' }).trim().isLength({ max: 150 }),
];

export const updateRolePermissionsValidator = [
  body('permissions')
    .optional()
    .custom((value) => Array.isArray(value) || typeof value === 'string')
    .withMessage('Permisos invalidos.'),
];
