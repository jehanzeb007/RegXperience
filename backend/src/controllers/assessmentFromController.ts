import { Request, Response } from "express";
import { success, error as errResp, badRequest } from "../utils/response";
import * as assessmentFormService from "../services/assessmentFormService";
import { AuthRequest } from "../middleware/auth";
import { UpdateAssessmentFormDto } from "../validators/assessmentForm.dto";

export async function updateAssessmentForm(req: AuthRequest, res: Response) {
  try {
    const user = req.user;
    const assessmentFormId = req.params.formId;

    const body: UpdateAssessmentFormDto = req.body;

    const result = await assessmentFormService.updateAssessmentForm({
      assessmentId: assessmentFormId,
      user: user.id,
      payload: body,
    });

    return success(res, result, "Assessment form update", 200);
  } catch (err) {
    console.error(err);
    return errResp(res, "Failed to update assessment form", 500, err);
  }
}
