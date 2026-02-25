import { Box, Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import SendIcon from "@mui/icons-material/Send";
import { AssessmentStatus } from "@/types/assessment";

interface Props {
  status?: AssessmentStatus;
}

export default function StatusChip({ status }: Props) {
  if (!status) return null;

  const getColor = () => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      case "in review":
        return "warning";
      case "submitted":
        return "info";
      default:
        return "default";
    }
  };

  const getIcon = () => {
    switch (status) {
      case "approved":
        return <CheckCircleIcon fontSize="small" />;
      case "rejected":
        return <CancelIcon fontSize="small" />;
      case "in review":
        return <HourglassTopIcon fontSize="small" />;
      case "submitted":
        return <SendIcon fontSize="small" />;
      default:
        return undefined;
    }
  };

  return (
    <Box mt={1} display="flex" gap={1} flexWrap="wrap">
      <Chip
        icon={getIcon()}
        label={status}
        color={getColor()}
        size="small"
        sx={{ textTransform: "capitalize", fontWeight: 600 }}
      />
    </Box>
  );
}
