"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import useAppDispatch from "@/hooks/useAppDispatch";
import useToast from "@/hooks/useToast";
import { updateForm } from "@/store/assessmentSlice";
import { getErrorMessage } from "@/utils/errorHandler";
import StatusChip from "./StatusChip";
import {
  AssessmentForm as AssessmentFormType,
  AssessmentStatus,
} from "@/types/assessment";
import useAppSelector from "@/hooks/useAppSelector";

interface Props {
  form: AssessmentFormType;
}

interface FormValues {
  controleOwner: string;
  implementationNote: string;
  status: AssessmentStatus;
}

const STATUS_OPTIONS: AssessmentStatus[] = [
  "pending",
  "submitted",
  "in review",
  "approved",
  "rejected",
];

// ✅ Validation Schema
const validationSchema = Yup.object({
  controleOwner: Yup.string().trim().required("Control Owner is required"),
  implementationNote: Yup.string()
    .trim()
    .required("Implementation Note is required"),
  status: Yup.string().required("Status is required"),
});

export default function AssessmentForm({ form }: Props) {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user } = useAppSelector((s) => s.auth);

  const isClient = user?.role === "client";

  const handleSubmit = async (
    values: FormValues,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    try {
      console.log("Submitting form with values:", form, values);
      await dispatch(
        updateForm({ formId: form._id, payload: values }),
      ).unwrap();

      toast.success("Form saved");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik<FormValues>
      initialValues={{
        controleOwner: form.controleOwner ?? "",
        implementationNote: form.implementationNote ?? "",
        status: form.status ?? "pending",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) =>
        handleSubmit(values, setSubmitting)
      }
    >
      {({
        isSubmitting,
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
      }) => (
        <Form>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* ✅ Control Owner */}
            <TextField
              name="controleOwner"
              label="Control Owner"
              fullWidth
              value={values.controleOwner}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.controleOwner && Boolean(errors.controleOwner)}
              helperText={touched.controleOwner && errors.controleOwner}
            />

            {/* ✅ Implementation Note */}
            <TextField
              name="implementationNote"
              label="Implementation Note"
              fullWidth
              multiline
              rows={4}
              value={values.implementationNote}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.implementationNote && Boolean(errors.implementationNote)
              }
              helperText={
                touched.implementationNote && errors.implementationNote
              }
            />

            {/* 🔥 ROLE BASED STATUS CONTROL */}
            {isClient ? (
              <StatusChip status={values.status} />
            ) : (
              <FormControl
                fullWidth
                size="small"
                error={touched.status && Boolean(errors.status)}
              >
                <InputLabel>Status</InputLabel>
                <Select
                  value={values.status}
                  label="Status"
                  onChange={(e) =>
                    setFieldValue("status", e.target.value as AssessmentStatus)
                  }
                  onBlur={handleBlur}
                  name="status"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
                {touched.status && errors.status && (
                  <FormHelperText>{errors.status}</FormHelperText>
                )}
              </FormControl>
            )}

            <Box>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
