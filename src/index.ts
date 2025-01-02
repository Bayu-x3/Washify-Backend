import { Hono } from 'hono';
import { OutletRoutes } from './routes/outlets';
import { UserRoutes } from './routes/users';
import { PaketRoutes } from './routes/pakets';
import { MemberRoutes } from './routes/members';
import { TransaksiRoutes } from './routes/transaksi';
import { DetailTransaksiRoutes } from './routes/detailTransaksi';
import { AuthRoutes } from './routes/auth';

const app = new Hono().basePath('/api');

const registeredRoutes: string[] = [];

const logRoute = (prefix: string, AuthRoutes?: unknown) => {
  registeredRoutes.push(prefix);
  console.log(`Registered route: ${prefix}`);
};

// Daftar semua route
app.route('/outlets', OutletRoutes);
logRoute('/api/outlets');

app.route('/users', UserRoutes);
logRoute('/api/users');

app.route('/pakets', PaketRoutes);
logRoute('/api/pakets');

app.route('/members', MemberRoutes);
logRoute('/api/members');

app.route('/transaksi', TransaksiRoutes);
logRoute('/api/transaksi');

app.route('/details', DetailTransaksiRoutes);
logRoute('/api/details');

app.route('/', AuthRoutes);
logRoute('/api', AuthRoutes);

console.log('All registered routes:', registeredRoutes);

app.fire();

export default app;