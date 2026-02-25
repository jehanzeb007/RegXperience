"use client";

import { useAppDispatch } from "./useAppDispatch";
import { addToast, ToastType } from "../store/toastSlice";

type UseToastOptions = {
  duration?: number;
};

export default function useToast() {
  const dispatch = useAppDispatch();

  const showToast = (
    message: string,
    type: ToastType = "info",
    options?: UseToastOptions,
  ) => {
    dispatch(addToast({ message, type }));
  };

  const success = (message: string, options?: UseToastOptions) => {
    showToast(message, "success", options);
  };

  const error = (message: string, options?: UseToastOptions) => {
    showToast(message, "error", options);
  };

  const info = (message: string, options?: UseToastOptions) => {
    showToast(message, "info", options);
  };

  const warning = (message: string, options?: UseToastOptions) => {
    showToast(message, "warning", options);
  };

  return { showToast, success, error, info, warning };
}
