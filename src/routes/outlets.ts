import { Hono } from "hono";
import { getOutlets, getOutletById ,createOutlets, updateOutlets, deleteOutlets } from "../controllers/OutletsController";

const OutletRoutes = new Hono();

OutletRoutes.get("/", getOutlets);   
OutletRoutes.get("/:id", getOutletById);
OutletRoutes.post("/", createOutlets);   
OutletRoutes.put("/:id", updateOutlets);   
OutletRoutes.delete("/:id", deleteOutlets);

export {OutletRoutes}