import { body, param } from 'express-validator';
import { PurchaseStatus } from '../enums/purchase-status.enum';

export const createPurchaseValidator = [
  body('supplierId').isUUID().withMessage('Proveedor invalido.'),
  body('purchaseDate').isISO8601().withMessage('Fecha de compra invalida.'),
  body('details').isArray({ min: 1 }).withMessage('Debe incluir al menos un detalle.'),
  body('details.*.productId').isUUID().withMessage('Producto invalido.'),
  body('details.*.quantity').isFloat({ gt: 0 }).withMessage('Cantidad debe ser mayor a cero.'),
  body('details.*.unitCost').isFloat({ min: 0 }).withMessage('Costo unitario no valido.'),
];

export const updatePurchaseStatusValidator = [
  param('id').isUUID().withMessage('Id de compra invalido.'),
  body('status').isIn(Object.values(PurchaseStatus)).withMessage('Estado de compra invalido.'),
];