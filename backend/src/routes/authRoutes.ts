import { Router } from "express";
import { login, register } from "../controllers/authController";
import { validateBody } from "../middleware/validate";
import { LoginDto, RegisterDto } from "../validators/auth.dto";

const router = Router();

router.post("/login", validateBody(LoginDto), login);
router.post("/register", validateBody(RegisterDto), register);

export default router;
