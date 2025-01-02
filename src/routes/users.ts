import { Hono } from "hono";
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware";
import { getUsers, getUserById,createUser, updateUser, deleteUser } from "../controllers/UserController";

const UserRoutes = new Hono();
UserRoutes.use('*', authMiddleware);

UserRoutes.get('/', roleMiddleware(['admin']), getUsers);
UserRoutes.get("/:id", roleMiddleware(['admin']), getUserById);
UserRoutes.post("/", roleMiddleware(['admin']), createUser);
UserRoutes.put("/:id", roleMiddleware(['admin']), updateUser);
UserRoutes.delete("/:id", roleMiddleware(['admin']), deleteUser);

export {UserRoutes}