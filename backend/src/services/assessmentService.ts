import Assessment, { IAssessment } from "../models/Assessment";
import AssessmentForm from "../models/AssessmentForm";
import { RequestUser } from "../types/express";

const SAMPLE_CONTROLE_OWNERS = [
  "SOC 2 Compliance",
  "ISO 27001 Compliance",
  "Data Security",
  "Access Control",
  "Audit Logging",
];

export async function createAssessment(data: {
  userId: string;
  title: string;
  type: string;
  description: string;
  file?: string;
}) {
  const assessment = await Assessment.create(data);

  // Auto-generate 4-5 AssessmentForm records
  const count = Math.floor(Math.random() * 2) + 4; // 4 or 5
  const formsData = [];
  for (let i = 0; i < count; i++) {
    formsData.push({
      assessmentId: assessment._id,
      controleOwner: "",
      implementationNote: "",
      evidenceFile: "",
    });
  }
  const forms = await AssessmentForm.insertMany(formsData);

  return { assessment, forms };
}

export async function findAssessments(user: RequestUser) {
  let payload = {};
  const { id: userId, role } = user;
  if (role === "client") {
    payload = { userId };
  }
  return Assessment.find(payload).populate("forms");
  // .populate("userId", "name email");
}

export async function findAssessmentFormsByAssessmentId(assessmentId: string) {
  console.log("Finding forms for assessmentId:", assessmentId);
  return Assessment.findById(assessmentId).populate("forms");
}
