import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { success } from "../utils/response";

const router = Router();

router.get("/public", (req, res) => success(res, { msg: "public route" }));

router.get("/protected", requireAuth, (req, res) =>
  success(res, { msg: "protected route", user: (req as any).user }),
);

router.get("/manager-only", requireAuth, requireRole("manager"), (req, res) =>
  success(res, { msg: "manager content" }),
);

export default router;
