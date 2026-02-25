import { Request, Response } from "express";
import { success, error as errResp, badRequest } from "../utils/response";
import * as assessmentService from "../services/assessmentService";
import { AuthRequest } from "../middleware/auth";

export async function createAssessment(req: AuthRequest, res: Response) {
  try {
    const user = req.user;

    const { title, type, description } = req.body;

    if (!req.file) {
      return badRequest(res, "file is required");
    }

    const result = await assessmentService.createAssessment({
      userId: user.id,
      title,
      type,
      description,
      file: req.file.path,
    });

    return success(res, result, "Assessment created with forms", 201);
  } catch (err) {
    console.error(err);
    return errResp(res, "Failed to create assessment", 500, err);
  }
}

export async function getAssessments(req: AuthRequest, res: Response) {
  try {
    const user = req.user;
    console.log("Fetching assessments for user:", user);
    const assessments = await assessmentService.findAssessments(user);
    return success(res, { assessments });
  } catch (err) {
    console.error(err);
    return errResp(res, "Failed to fetch assessments", 500, err);
  }
}

export async function getAssessmentForms(req: AuthRequest, res: Response) {
  try {
    const { assessmentId } = req.params;
    if (!assessmentId) return badRequest(res, "assessmentId is required");

    const assessment =
      await assessmentService.findAssessmentFormsByAssessmentId(assessmentId);
    return success(res, { assessment });
  } catch (err) {
    console.error(err);
    return errResp(res, "Failed to fetch forms", 500, err);
  }
}
