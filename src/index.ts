import { Hono } from 'hono';
import { OutletRoutes } from './routes/outlets';
import { UserRoutes } from './routes/users';
import { PaketRoutes } from './routes/pakets';
import { MemberRoutes } from './routes/members';
import { TransaksiRoutes } from './routes/transaksi';
import { DetailTransaksiRoutes } from './routes/detailTransaksi';
import { AuthRoutes } from './routes/auth';
import { DashboardRoutes } from './routes/dashboard';

// Middleware CORS
const corsMiddleware = (ctx: any, next: any) => {
  ctx.header('Access-Control-Allow-Origin', '*');
  ctx.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  ctx.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Jika permintaan adalah OPTIONS (preflight request), segera kembalikan response
  if (ctx.req.method === 'OPTIONS') {
    return ctx.body('OK');
  }
  
  return next();
};

const app = new Hono().basePath('/api');

// Tambahkan middleware CORS
app.use(corsMiddleware);

// Daftar semua route
app.route('/outlets', OutletRoutes);
console.log('Registered route: /api/outlets');

app.route('/users', UserRoutes);
console.log('Registered route: /api/users');

app.route('/pakets', PaketRoutes);
console.log('Registered route: /api/pakets');

app.route('/members', MemberRoutes);
console.log('Registered route: /api/members');

app.route('/transaksi', TransaksiRoutes);
console.log('Registered route: /api/transaksi');

app.route('/details', DetailTransaksiRoutes);
console.log('Registered route: /api/details');

app.route('/dashboard', DashboardRoutes);
console.log('Registered route: /api/dashboard');

app.route('/', AuthRoutes);
console.log('Registered route: /api');

// Jalankan aplikasi
app.fire();

export default app;
