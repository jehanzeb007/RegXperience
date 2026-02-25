import AssessmentForm from "../models/AssessmentForm";
import { IUser } from "../models/User";
import { UpdateAssessmentFormDto } from "../validators/assessmentForm.dto";
import { Types } from "mongoose";

interface UpdateAssessmentFormParams {
  assessmentId: string;
  user: IUser;
  payload: UpdateAssessmentFormDto;
}

export async function updateAssessmentForm({
  assessmentId,
  user,
  payload,
}: UpdateAssessmentFormParams) {
  // 1️⃣ Update existing assessment form
  console.log("Updating assessment form with ID:", assessmentId);
  if (user.role === "manager") {
    payload.status = payload.status || "pending";
  }
  const updatedAssessment = await AssessmentForm.findOneAndUpdate(
    {
      _id: assessmentId,
    },
    {
      $set: payload,
    },
    { new: true },
  );

  if (!updatedAssessment) {
    throw new Error("Assessment form not found");
  }

  return {
    updatedAssessment,
  };
}
