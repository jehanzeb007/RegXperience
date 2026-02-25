"use client";

import React, { useEffect } from "react";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import useAppSelector from "../hooks/useAppSelector";
import useAppDispatch from "../hooks/useAppDispatch";
import { removeToast } from "../store/toastSlice";

export default function Toaster() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((s) => s.toast.toasts);

  return (
    <Stack
      sx={{
        position: "fixed",
        top: 20,
        right: 20,
        maxWidth: 400,
        zIndex: 9999,
        gap: 1,
      }}
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => dispatch(removeToast(toast.id))}
        />
      ))}
    </Stack>
  );
}

function ToastItem({
  toast,
  onClose,
}: {
  toast: { id: string; message: string; type: string };
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Alert
      onClose={onClose}
      severity={toast.type as "success" | "error" | "warning" | "info"}
      sx={{ boxShadow: 2 }}
    >
      {toast.message}
    </Alert>
  );
}
