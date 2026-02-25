import { Box } from "@mui/material";
import { AssessmentForm as AssessmentFormType } from "@/types/assessment";
import AssessmentForm from "./AssessmentForm";

interface Props {
  value: number;
  index: number;
  form: AssessmentFormType;
}

export default function FormTabPanel({ value, index, form }: Props) {
  if (value !== index) return null;

  return (
    <Box sx={{ p: 2 }}>
      <AssessmentForm form={form} />
    </Box>
  );
}
