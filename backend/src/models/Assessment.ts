import { Schema, model, Document, Types } from "mongoose";

export interface IAssessment extends Document {
  userId: Types.ObjectId; // Client user ID
  title: string;
  type: string;
  description: string;
  file?: string;
  sourceFile?: string; // For AI-generated assessments
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    file: { type: String },
    sourceFile: { type: String },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

// virtual populate for forms
AssessmentSchema.virtual("forms", {
  ref: "AssessmentForm",
  localField: "_id",
  foreignField: "assessmentId",
});

export default model<IAssessment>("Assessment", AssessmentSchema);
