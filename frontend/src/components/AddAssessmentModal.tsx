"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  createAssessment,
  Assessment,
  CreateAssessmentPayload,
  fetchAssessments,
} from "../store/assessmentSlice";
import useAppDispatch from "../hooks/useAppDispatch";
import useToast from "../hooks/useToast";
import { getErrorMessage } from "../utils/errorHandler";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const AssessmentSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  type: Yup.string()
    .oneOf(["Quiz", "Assignment", "Exam"])
    .required("Type is required"),
  description: Yup.string(),
  file: Yup.mixed<File>()
    .required("PDF file is required")
    .test(
      "fileType",
      "Only PDF files are allowed",
      (value: File | null | undefined) => {
        if (!value) return false;
        return value.type === "application/pdf";
      },
    ),
});

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddAssessmentModal({ open, onClose }: Props) {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const handleSubmit = async (
    values: { title: string; type: string; description: string; file: File },
    {
      setSubmitting,
    }: FormikHelpers<{
      title: string;
      type: string;
      description: string;
      file: File;
    }>,
  ) => {
    try {
      console.log("Submitting assessment with values:", values);
      await dispatch(
        createAssessment({
          title: values.title,
          type: values.type as "Quiz" | "Assignment" | "Exam",
          description: values.description,
          file: values.file,
        }),
      )
        .unwrap()
        .then(() => {
          dispatch(fetchAssessments())
            .unwrap()
            .catch((err) => toast.error(getErrorMessage(err)));
        });
      toast.success("Assessment created successfully!");
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Assessment</DialogTitle>
      <Formik
        initialValues={{
          title: "",
          type: "",
          description: "",
          file: undefined as unknown as File,
        }}
        validationSchema={AssessmentSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched, setFieldValue, values }) => (
          <Form>
            <DialogContent>
              <Box display="flex" flexDirection="column" gap={2}>
                <Field
                  as={TextField}
                  name="title"
                  label="Assessment Title"
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                  fullWidth
                  autoFocus
                />
                <Field
                  as={Select}
                  name="type"
                  fullWidth
                  displayEmpty
                  error={Boolean(touched.type && errors.type)}
                  renderValue={(selected: string) => {
                    if (!selected) {
                      return (
                        <span style={{ color: "#9e9e9e" }}>
                          Select Assessment Type
                        </span>
                      );
                    }
                    return selected;
                  }}
                >
                  <MenuItem value="Quiz">Quiz</MenuItem>
                  <MenuItem value="Assignment">Assignment</MenuItem>
                  <MenuItem value="Exam">Exam</MenuItem>
                </Field>
                <Field
                  as={TextField}
                  name="description"
                  label="Description"
                  error={Boolean(touched.description && errors.description)}
                  helperText={touched.description && errors.description}
                  fullWidth
                  multiline
                  rows={4}
                />
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Upload PDF File
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Please upload a PDF document (max size 5MB).
                  </Typography>

                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                    sx={{
                      py: 2,
                      borderStyle: "dashed",
                    }}
                  >
                    Choose PDF File
                    <input
                      type="file"
                      hidden
                      accept=".pdf"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.currentTarget.files?.[0];
                        if (file) {
                          setFieldValue("file", file);
                        }
                      }}
                    />
                  </Button>

                  {/* Validation Error */}
                  {errors.file && touched.file && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{ mt: 1, display: "block" }}
                    >
                      {errors.file as string}
                    </Typography>
                  )}

                  {/* Selected File Preview */}
                  {values.file && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1.5,
                        p: 1,
                        bgcolor: "#f5f5f5",
                        borderRadius: 1,
                      }}
                    >
                      <PictureAsPdfIcon color="error" />
                      <Typography variant="caption">
                        {(values.file as File).name}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
