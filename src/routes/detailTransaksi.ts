import { Hono } from "hono";
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware";
import { getDetailTransaksi, getDetailTransaksiById ,createDetailTransaksi, updateDetailTransaksi, deleteDetailTransaksi } from "../controllers/DetailTransaksiController";

const DetailTransaksiRoutes = new Hono();
DetailTransaksiRoutes.use('*', authMiddleware);

DetailTransaksiRoutes.get('/', roleMiddleware(['admin', 'kasir', 'owner']), getDetailTransaksi);
DetailTransaksiRoutes.get("/:id", roleMiddleware(['admin', 'kasir']), getDetailTransaksiById);
DetailTransaksiRoutes.post("/", roleMiddleware(['admin', 'kasir']), createDetailTransaksi);
DetailTransaksiRoutes.put("/:id", roleMiddleware(['admin', 'kasir']), updateDetailTransaksi);
DetailTransaksiRoutes.delete("/:id", roleMiddleware(['admin', 'kasir']), deleteDetailTransaksi);

export {DetailTransaksiRoutes}