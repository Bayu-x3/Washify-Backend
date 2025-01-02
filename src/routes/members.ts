import { Hono } from "hono";
import { getMembers, getMemberById, createMember, updateMember, deleteMember } from "../controllers/MembersController";

const MemberRoutes = new Hono();

MemberRoutes.get("/", getMembers);   
MemberRoutes.get("/:id", getMemberById);
MemberRoutes.post("/", createMember);   
MemberRoutes.put("/:id", updateMember);   
MemberRoutes.delete("/:id", deleteMember);

export {MemberRoutes}