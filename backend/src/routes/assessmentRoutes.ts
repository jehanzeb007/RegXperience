import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { CreateAssessmentDto } from "../validators/assessment.dto";
import {
  createAssessment,
  getAssessments,
  getAssessmentForms,
} from "../controllers/assessmentController";
import { defaultUpload } from "../utils/multer";

const router = Router();

// Client can create assessments
router.post(
  "/",
  requireAuth,
  defaultUpload.single("file"),
  validateBody(CreateAssessmentDto),
  createAssessment,
);

// Client can view their assessments
router.get("/", requireAuth, getAssessments);

// View assessment forms for a specific assessment
router.get("/:assessmentId", requireAuth, getAssessmentForms);

export default router;
