import { Hono } from "hono";
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware";
import { getTransaksi, getTransaksiById ,createTransaksi, updateTransaksi, deleteTransaksi } from "../controllers/TransaksiController";

const TransaksiRoutes = new Hono();
TransaksiRoutes.use('*', authMiddleware);

TransaksiRoutes.get('/', roleMiddleware(['admin', 'kasir', 'owner']), getTransaksi);
TransaksiRoutes.get("/:id", roleMiddleware(['admin', 'kasir']), getTransaksiById);
TransaksiRoutes.post("/", roleMiddleware(['admin', 'kasir']), createTransaksi);
TransaksiRoutes.put("/:id", roleMiddleware(['admin', 'kasir']), updateTransaksi);
TransaksiRoutes.delete("/:id", roleMiddleware(['admin', 'kasir']), deleteTransaksi);

export {TransaksiRoutes}