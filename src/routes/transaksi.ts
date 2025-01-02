import { Hono } from "hono";
import { getTransaksi, getTransaksiById ,createTransaksi, updateTransaksi, deleteTransaksi } from "../controllers/TransaksiController";

const TransaksiRoutes = new Hono();

TransaksiRoutes.get("/", getTransaksi);   
TransaksiRoutes.get("/:id", getTransaksiById);
TransaksiRoutes.post("/", createTransaksi);   
TransaksiRoutes.put("/:id", updateTransaksi);   
TransaksiRoutes.delete("/:id", deleteTransaksi);

export {TransaksiRoutes}