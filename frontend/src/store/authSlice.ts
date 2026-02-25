import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../lib/axios";
import { AuthState, LoginPayload, LoginResponse } from "../types";

interface ErrorPayload {
  message: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk<LoginResponse, LoginPayload>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", payload);
      console.log("Login response:", res.data);
      return res.data.data as LoginResponse;
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      return rejectWithValue(
        axiosError?.response?.data || { message: (err as Error).message },
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<Partial<LoginResponse>>) {
      const { token, user } = action.payload;
      if (token) {
        state.token = token;
        try {
          localStorage.setItem("auth.token", token);
        } catch (e) {}
      }
      if (user) {
        state.user = user;
        try {
          localStorage.setItem("auth.user", JSON.stringify(user));
        } catch (e) {}
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      //   setAuthToken(undefined);
      try {
        localStorage.removeItem("auth.token");
        localStorage.removeItem("auth.user");
      } catch (e) {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          console.log("Login successful:", action.payload);
          state.loading = false;
          state.token = action.payload.token;
          state.user = action.payload.user ?? null;
          if (action.payload.token) {
            // setAuthToken(action.payload.token);
            try {
              localStorage.setItem("auth.token", action.payload.token);
              localStorage.setItem(
                "auth.user",
                JSON.stringify(action.payload.user),
              );
            } catch (e) {}
          }
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ErrorPayload)?.message || "Login failed";
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;

export default authSlice.reducer;
