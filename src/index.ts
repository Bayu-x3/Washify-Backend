import { Hono } from 'hono';
import { OutletRoutes } from './routes/outlets';

const app = new Hono().basePath('/api');

const registeredRoutes: string[] = [];
const logRoute = (prefix: string) => {
  registeredRoutes.push(prefix);
  console.log(`Registered route: ${prefix}`);
};

app.route('/outlets', OutletRoutes);
logRoute('/api/outlets');

console.log('All registered routes:', registeredRoutes);

app.fire();

export default app;
