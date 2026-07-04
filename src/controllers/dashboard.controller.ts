import { Request, Response } from 'express';

export class DashboardController {
  index(req: Request, res: Response): void {
    res.render('dashboard/index', {
      user: req.session.user,
      error: null,
    });
  }
}