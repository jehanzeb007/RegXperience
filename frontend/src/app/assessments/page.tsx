"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Stack,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";
import AddAssessmentModal from "../../components/AddAssessmentModal";
import useAppDispatch from "../../hooks/useAppDispatch";
import useAppSelector from "../../hooks/useAppSelector";
import { fetchAssessments } from "../../store/assessmentSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getErrorMessage } from "@/utils/errorHandler";
import useToast from "@/hooks/useToast";

export default function AssessmentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { assessments, loading } = useAppSelector((s) => s.assessment);
  const toast = useToast();
  const router = useRouter();
  const auth = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchAssessments())
      .unwrap()
      .catch((err) => toast.error(getErrorMessage(err)));
  }, [dispatch]);

  return (
    <ProtectedRoute>
      <Container sx={{ mt: 5 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={5}
        >
          <Typography variant="h4" fontWeight={600}>
            Assessments
          </Typography>

          {auth.user?.role === "client" && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setModalOpen(true)}
            >
              Add Assessment
            </Button>
          )}
        </Box>

        {loading ? (
          <LoadingSpinner />
        ) : assessments?.length === 0 ? (
          <Box textAlign="center" mt={10}>
            <DescriptionIcon sx={{ fontSize: 60, color: "grey.400" }} />
            <Typography variant="h6" mt={2}>
              No assessments yet
            </Typography>
            <Typography color="text.secondary">
              Create your first assessment to get started.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={3}>
            {assessments?.map((assessment) => {
              const aid =
                assessment.id || (assessment as unknown as { _id: string })._id;

              return (
                <Card
                  key={aid}
                  onClick={() => router.push(`/assessments/${aid}`)}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 3,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: 8,
                    },
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box flex={1}>
                        {/* Title */}
                        <Typography variant="h6" fontWeight={600}>
                          {assessment.title}
                        </Typography>

                        {/* Description */}
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mt={2}
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {assessment.description}
                        </Typography>

                        {/* File */}
                        {assessment.fileUrl && (
                          <Box
                            mt={2}
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            <PictureAsPdfIcon color="error" />
                            <Typography
                              variant="body2"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(assessment.fileUrl, "_blank");
                              }}
                              sx={{ cursor: "pointer" }}
                            >
                              {assessment.fileName || "Download PDF"}
                            </Typography>
                          </Box>
                        )}

                        <Divider sx={{ my: 2 }} />

                        {/* Footer */}
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            <CalendarTodayIcon
                              fontSize="small"
                              color="action"
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(
                                assessment.createdAt || "",
                              ).toLocaleDateString()}
                            </Typography>
                          </Box>

                          <Tooltip title="View details">
                            <IconButton size="small">
                              <DescriptionIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}

        <AddAssessmentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </Container>
    </ProtectedRoute>
  );
}
