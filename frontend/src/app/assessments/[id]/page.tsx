"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Container } from "@mui/material";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAppSelector from "@/hooks/useAppSelector";
import { fetchAssessment } from "@/store/assessmentSlice";
import useToast from "@/hooks/useToast";
import { getErrorMessage } from "@/utils/errorHandler";

import AssessmentHeader from "./components/AssessmentHeader";
import FormsTabs from "./components/FormsTabs";
import { Assessment } from "@/types/assessment";

export default function AssessmentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const { currentAssessment, loading } = useAppSelector(
    (s) => s.assessment,
  ) as {
    currentAssessment: Assessment | null;
    loading: boolean;
  };

  useEffect(() => {
    if (!id) return;

    dispatch(fetchAssessment(id))
      .unwrap()
      .catch((err) => toast.error(getErrorMessage(err)));
  }, [id, dispatch]);

  if (loading || !currentAssessment) return <LoadingSpinner />;

  return (
    <ProtectedRoute>
      <Container sx={{ mt: 4 }}>
        <AssessmentHeader assessment={currentAssessment} />
        <FormsTabs forms={currentAssessment.forms ?? []} />
      </Container>
    </ProtectedRoute>
  );
}
