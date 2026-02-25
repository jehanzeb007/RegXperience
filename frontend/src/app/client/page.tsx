"use client";

import React from "react";
import { Container, Typography } from "@mui/material";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function ClientPage() {
  return (
    <ProtectedRoute>
      <Container sx={{ mt: 8 }}>
        <Typography variant="h4">Client Dashboard</Typography>
        <Typography sx={{ mt: 2 }}>Welcome, client user.</Typography>
      </Container>
    </ProtectedRoute>
  );
}
