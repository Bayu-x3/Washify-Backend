import { Hono } from "hono";
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware";
import { getOutlets, getOutletById, createOutlets, updateOutlets, deleteOutlets } from "../controllers/OutletsController";

const OutletRoutes = new Hono();

OutletRoutes.use('*', authMiddleware);

OutletRoutes.get('/', roleMiddleware(['admin', 'kasir', 'owner']), getOutlets);
OutletRoutes.get("/:id", roleMiddleware(['admin',]), getOutletById);
OutletRoutes.post("/", roleMiddleware(['admin',]), createOutlets);
OutletRoutes.put("/:id", roleMiddleware(['admin',]), updateOutlets);
OutletRoutes.delete("/:id", roleMiddleware(['admin',]), deleteOutlets);

export { OutletRoutes };
