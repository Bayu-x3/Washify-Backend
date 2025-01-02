import { Context } from "hono";

export interface CustomContext {
  user?: {
    id: number;
    username: string
    role: "admin" | "kasir" | "owner";
  };
}

export type AppContext = Context & CustomContext;