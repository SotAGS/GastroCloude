import { createApp } from './app';
import { connectDatabase } from './config/database.config';
import { env } from './config/env.config';
import { sessionStore } from './config/session.config';
import { BootstrapSecurityService } from './services/bootstrap-security.service';

const bootstrap = async (): Promise<void> => {
  await connectDatabase();
  await BootstrapSecurityService.ensureBaseSecurityData();
  await sessionStore.sync();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`GastroCloud ejecutandose en http://localhost:${env.port}`);
  });
};

bootstrap().catch((error) => {
  console.error('Error al iniciar la aplicacion:', error);
  process.exit(1);
});