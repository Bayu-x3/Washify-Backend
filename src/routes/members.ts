import { Hono } from "hono";
import { authMiddleware, roleMiddleware } from "../middlewares/authMiddleware";
import { getMembers, getMemberById, createMember, updateMember, deleteMember } from "../controllers/MembersController";

const MemberRoutes = new Hono();
MemberRoutes.use('*', authMiddleware);

MemberRoutes.get('/', roleMiddleware(['admin', 'kasir', 'owner']), getMembers);
MemberRoutes.get("/:id", roleMiddleware(['admin', 'kasir']), getMemberById);
MemberRoutes.post("/", roleMiddleware(['admin', 'kasir']), createMember);
MemberRoutes.put("/:id", roleMiddleware(['admin', 'kasir']), updateMember);
MemberRoutes.delete("/:id", roleMiddleware(['admin', 'kasir']), deleteMember);

export {MemberRoutes}