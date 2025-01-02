import { Hono } from "hono";
import { authMiddleware } from "../middlewares/authMiddleware";
import { register, login, logout } from "../controllers/AuthController";

export const AuthRoutes = new Hono();

AuthRoutes.post('/register', register);
AuthRoutes.post('/login', login);
AuthRoutes.post('/logout', logout);

AuthRoutes.get('/me', authMiddleware, (c) => {
    const user = c.get('user');
    return c.json({ success: true, data: user });
});

export const Routes = AuthRoutes;
