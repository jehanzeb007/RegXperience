"use client";

import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingSpinner() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}
    >
      <CircularProgress />
    </Box>
  );
}
