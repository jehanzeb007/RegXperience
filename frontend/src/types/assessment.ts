export type AssessmentStatus =
  | "pending"
  | "submitted"
  | "in review"
  | "approved"
  | "rejected";

export interface AssessmentForm {
  _id: string;
  controleOwner?: string;
  implementationNote?: string;
  status?: AssessmentStatus;
}

export interface Assessment {
  id?: string;
  _id?: string;
  title: string;
  type: string;
  description: string;
  fileUrl?: string;
  forms?: AssessmentForm[];
}
