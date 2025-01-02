import { Hono } from "hono";
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware";
import { getDashboardData } from "../controllers/DashboardController";

const DashboardRoutes = new Hono();
DashboardRoutes.use('*', authMiddleware);

DashboardRoutes.get('/', roleMiddleware(['admin', 'kasir', 'owner']), getDashboardData);

export {DashboardRoutes}