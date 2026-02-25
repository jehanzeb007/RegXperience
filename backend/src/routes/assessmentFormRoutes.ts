import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { defaultUpload } from "../utils/multer";
import { UpdateAssessmentFormDto } from "../validators/assessmentForm.dto";
import { updateAssessmentForm } from "../controllers/assessmentFromController";

const router = Router();

// Client can create assessments
router.patch(
  "/:formId",
  requireAuth,
  validateBody(UpdateAssessmentFormDto),
  updateAssessmentForm,
);

export default router;
