import { Paper, Box, Typography, Button } from "@mui/material";
import { Assessment } from "@/types/assessment";

interface Props {
  assessment: Assessment;
}

export default function AssessmentHeader({ assessment }: Props) {
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography variant="h5">{assessment.title}</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {assessment.type} — {assessment.description}
          </Typography>

          {assessment.fileUrl && (
            <Button href={assessment.fileUrl} target="_blank" sx={{ mt: 1 }}>
              View Document
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
