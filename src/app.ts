import express from 'express';
import path from 'path';
import methodOverride from 'method-override';
import routes from './routes/index.routes';
import { configureViews } from './config/view.config';
import { sessionMiddleware } from './config/session.config';
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/not-found.middleware';
import { BootstrapSecurityService } from './services/bootstrap-security.service';

export const createApp = () => {
  const app = express();

  configureViews(app);

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(methodOverride('_method'));
  app.use(sessionMiddleware);
  app.use(express.static(path.join(process.cwd(), 'src', 'public')));

  app.use((req, res, next) => {
    res.locals.user = req.session.user ?? null;
    res.locals.demoAccounts = BootstrapSecurityService.getDemoAccounts();
    next();
  });

  app.use(routes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};