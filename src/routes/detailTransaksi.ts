import { Hono } from "hono";
import { getDetailTransaksi, getDetailTransaksiById ,createDetailTransaksi, updateDetailTransaksi, deleteDetailTransaksi } from "../controllers/DetailTransaksiController";

const DetailTransaksiRoutes = new Hono();

DetailTransaksiRoutes.get("/", getDetailTransaksi);   
DetailTransaksiRoutes.get("/:id", getDetailTransaksiById);
DetailTransaksiRoutes.post("/", createDetailTransaksi);   
DetailTransaksiRoutes.put("/:id", updateDetailTransaksi);   
DetailTransaksiRoutes.delete("/:id", deleteDetailTransaksi);

export {DetailTransaksiRoutes}