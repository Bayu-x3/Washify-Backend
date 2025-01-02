import { Hono } from "hono";
import { getUsers, getUserById,createUser, updateUser, deleteUser } from "../controllers/UserController";

const UserRoutes = new Hono();

UserRoutes.get("/", getUsers);   
UserRoutes.get("/:id", getUserById);
UserRoutes.post("/", createUser);   
UserRoutes.put("/:id", updateUser);   
UserRoutes.delete("/:id", deleteUser);

export {UserRoutes}