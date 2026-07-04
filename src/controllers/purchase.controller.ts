import { NextFunction, Request, Response } from 'express';
import { PurchaseStatus } from '../enums/purchase-status.enum';
import { PurchaseService } from '../services/purchase.service';

export class PurchaseController {
  private readonly purchaseService = new PurchaseService();

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const purchases = await this.purchaseService.listPurchases();
      res.render('compras/index', { purchases, user: req.session.user });
    } catch (error) {
      next(error);
    }
  }

  newForm(req: Request, res: Response): void {
    res.render('compras/new', { user: req.session.user });
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const purchase = await this.purchaseService.createPurchase(req.body, req.session.user!.id);
      res.redirect(`/compras/${purchase.id}`);
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const purchaseId = String(req.params.id);
      const purchase = await this.purchaseService.getById(purchaseId);
      res.render('compras/show', { purchase, user: req.session.user });
    } catch (error) {
      next(error);
    }
  }

  async markReceived(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const purchaseId = String(req.params.id);
      await this.purchaseService.changeStatus(purchaseId, PurchaseStatus.RECIBIDA, req.session.user!.id);
      res.redirect(`/compras/${purchaseId}`);
    } catch (error) {
      next(error);
    }
  }

  async markCancelled(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const purchaseId = String(req.params.id);
      await this.purchaseService.changeStatus(purchaseId, PurchaseStatus.CANCELADA, req.session.user!.id);
      res.redirect(`/compras/${purchaseId}`);
    } catch (error) {
      next(error);
    }
  }
}