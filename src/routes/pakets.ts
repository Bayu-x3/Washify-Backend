import { Hono } from "hono";
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware";
import { getPakets, getPaketById, createPaket, updatePaket, deletePaket } from "../controllers/PaketsController";

const PaketRoutes = new Hono();

PaketRoutes.use('*', authMiddleware);

PaketRoutes.get('/', roleMiddleware(['admin', 'kasir', 'owner']), getPakets);
PaketRoutes.get("/:id", roleMiddleware(['admin', 'kasir']), getPaketById);
PaketRoutes.post("/", roleMiddleware(['admin', 'kasir']), createPaket);
PaketRoutes.put("/:id", roleMiddleware(['admin', 'kasir']), updatePaket);
PaketRoutes.delete("/:id", roleMiddleware(['admin', 'kasir']), deletePaket);

export { PaketRoutes };
