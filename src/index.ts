import { Hono } from 'hono';
import { OutletRoutes } from './routes/outlets';
import { UserRoutes } from './routes/users';

const app = new Hono().basePath('/api');

const registeredRoutes: string[] = [];
const logRoute = (prefix: string) => {
  registeredRoutes.push(prefix);
  console.log(`Registered route: ${prefix}`);
};

app.route('/outlets', OutletRoutes);
logRoute('/api/outlets');

app.route('/users', UserRoutes);
logRoute('/api/users');

console.log('All registered routes:', registeredRoutes);

app.fire();

export default app;
