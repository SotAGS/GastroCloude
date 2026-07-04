import path from 'path';
import { Express } from 'express';

export const configureViews = (app: Express): void => {
  app.set('views', path.join(__dirname, '..', 'views'));
  app.set('view engine', 'ejs');
};