import { Hono } from "hono";
import { getPakets, getPaketById ,createPaket, updatePaket, deletePaket } from "../controllers/PaketsController";

const PaketRoutes = new Hono();

PaketRoutes.get("/", getPakets);   
PaketRoutes.get("/:id", getPaketById);
PaketRoutes.post("/", createPaket);   
PaketRoutes.put("/:id", updatePaket);   
PaketRoutes.delete("/:id", deletePaket);

export {PaketRoutes}