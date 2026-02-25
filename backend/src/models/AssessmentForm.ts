import { Schema, model, Document, Types } from "mongoose";
import {
  ASSESSMENT_STATUSES,
  AssessmentStatus,
} from "../constants/assessmentStatus";

export interface IAssessmentForm extends Document {
  assessmentId: Types.ObjectId; // Reference to Assessment
  controleOwner: string;
  implementationNote: string;
  evidenceFile?: string;
  status: AssessmentStatus;
}

const AssessmentFormSchema = new Schema<IAssessmentForm>(
  {
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },
    controleOwner: { type: String, required: false },
    implementationNote: { type: String, required: false },
    evidenceFile: { type: String, required: false },
    status: {
      type: String,
      enum: ASSESSMENT_STATUSES,
      default: "pending",
    },
  },
  { timestamps: true },
);

export default model<IAssessmentForm>("AssessmentForm", AssessmentFormSchema);
