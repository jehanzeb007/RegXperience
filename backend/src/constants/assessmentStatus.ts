export const ASSESSMENT_STATUSES = [
  "pending",
  "submitted",
  "in review",
  "approved",
  "rejected",
] as const;

export type AssessmentStatus = (typeof ASSESSMENT_STATUSES)[number];
