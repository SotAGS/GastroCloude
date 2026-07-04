import { NextFunction, Request, Response } from 'express';
import { StockService } from '../services/stock.service';

export class StockController {
  private readonly stockService = new StockService();

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stockItems = await this.stockService.listCurrentStock();
      res.render('stock/index', {
        stockItems,
        user: req.session.user,
      });
    } catch (error) {
      next(error);
    }
  }
}