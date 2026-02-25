import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../lib/axios";
import { AssessmentStatus } from "@/types/assessment";

export type Assessment = {
  id?: string;
  title: string;
  type?: "Quiz" | "Assignment" | "Exam";
  description?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt?: string;
  forms?: FormItem[];
};

export type CreateAssessmentPayload = {
  title: string;
  type?: "Quiz" | "Assignment" | "Exam";
  description?: string;
  file?: File;
};

export type FormItem = {
  _id: string;
  id?: string;
  assessmentId?: string;
  controleOwner?: string;
  implementationNote?: string;
  status?: AssessmentStatus;
  evidenceFile?: string;
  createdAt?: string;
  updatedAt?: string;
};

type AssessmentState = {
  assessments: Assessment[];
  currentAssessment: Assessment | null;
  loading: boolean;
  error: string | null;
};

const initialState: AssessmentState = {
  assessments: [],
  currentAssessment: null,
  loading: false,
  error: null,
};

export const createAssessment = createAsyncThunk<
  Assessment,
  CreateAssessmentPayload
>("assessment/createAssessment", async (payload, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("title", payload.title);
    if (payload.type) {
      formData.append("type", payload.type);
    }
    if (payload.description) {
      formData.append("description", payload.description);
    }
    if (payload.file) {
      formData.append("file", payload.file);
    }

    const res = await axiosInstance.post("/assessments", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data as Assessment;
  } catch (err: unknown) {
    const error = err as { response?: { data?: unknown }; message?: string };
    return rejectWithValue(error?.response?.data || { message: error.message });
  }
});

export const fetchAssessments = createAsyncThunk<Assessment[]>(
  "assessment/fetchAssessments",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/assessments");
      return res.data.data.assessments as Assessment[];
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown }; message?: string };
      return rejectWithValue(
        error?.response?.data || { message: error.message },
      );
    }
  },
);

export const fetchAssessment = createAsyncThunk<Assessment, string>(
  "assessment/fetchAssessment",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/assessments/${id}`);
      // backend returns assessment in res.data.data or res.data.assessment
      return (res.data.data?.assessment || res.data) as Assessment;
    } catch (err: unknown) {
      const error = err as { response?: { data?: unknown }; message?: string };
      return rejectWithValue(
        error?.response?.data || { message: error.message },
      );
    }
  },
);

export const updateForm = createAsyncThunk<
  FormItem,
  { formId: string; payload: Partial<FormItem> | FormData }
>("assessment/updateForm", async ({ formId, payload }, { rejectWithValue }) => {
  try {
    let res;
    if (payload instanceof FormData) {
      res = await axiosInstance.patch(`/forms/${formId}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      res = await axiosInstance.patch(`/forms/${formId}`, payload);
    }
    return (res.data.data.updatedAssessment || res.data) as FormItem;
  } catch (err: unknown) {
    const error = err as { response?: { data?: unknown }; message?: string };
    return rejectWithValue(error?.response?.data || { message: error.message });
  }
});

const assessmentSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssessments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAssessments.fulfilled,
        (state, action: PayloadAction<Assessment[]>) => {
          console.log("Fetched assessments:", action.payload);
          state.loading = false;
          state.assessments = action.payload;
        },
      )
      .addCase(fetchAssessments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Failed to fetch assessments";
      })
      .addCase(createAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createAssessment.fulfilled,
        (state, action: PayloadAction<Assessment>) => {
          state.loading = false;
        },
      )
      .addCase(createAssessment.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Failed to create assessment";
      });
    // fetch single assessment
    builder
      .addCase(fetchAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentAssessment = null;
      })
      .addCase(
        fetchAssessment.fulfilled,
        (state, action: PayloadAction<Assessment>) => {
          state.loading = false;
          state.currentAssessment = action.payload;
        },
      )
      .addCase(fetchAssessment.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Failed to fetch assessment";
      })
      .addCase(updateForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateForm.fulfilled,
        (state, action: PayloadAction<FormItem>) => {
          state.loading = false;
          if (state.currentAssessment?.forms) {
            const idx = state.currentAssessment.forms.findIndex(
              (f) =>
                f._id === action.payload._id || f.id === action.payload._id,
            );
            if (idx >= 0) state.currentAssessment.forms[idx] = action.payload;
            else state.currentAssessment.forms.push(action.payload);
          }
        },
      )
      .addCase(updateForm.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Failed to update form";
      });
  },
});

export default assessmentSlice.reducer;
